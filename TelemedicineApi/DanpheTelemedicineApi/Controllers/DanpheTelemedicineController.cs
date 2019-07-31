using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using DanpheTelemedicineApi.DalLayer;
using DanpheTelemedicineAPI.Utilities;
using DanpheTelemedicineAPI.CommonTypes;
using System.IO;
using System.Data.SqlClient;
using System.Data;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using DanpheTelemedicineApi.ServerModel;
using System.Configuration;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using DanpheTelemedicineAPI.Core.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;

namespace DanpheTelemedicineApi.Controllers
{
    [Produces("application/json")]
    [Route("api/DanpheTelemedicine")]
    public class DanpheTelemedicineController : Controller
    {
        //protected readonly string connString = null;
        private readonly DanpheTeleMedDbContext dbContext;
        private IHostingEnvironment _hostingEnvironment;
        public DanpheTelemedicineController(DanpheTeleMedDbContext context,
             IHostingEnvironment hostingEnvironment)
        {
            //connString = _config.Value.ConnectionString;
            dbContext = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public string Get(string reqType, int userid, string usernamelist, string useridlist, string username, string password, int documentid, string sessionid, int conferenceid)
        {

            //DanpheTeleMedDbContext dbContext = new DanpheTeleMedDbContext(connString);
            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();
            try
            {
                #region Get Old chat record for p2p communication
                if (reqType == "get-old-chat")
                {
                    var arr = useridlist.Split(',');
                    if (arr.Length == 2)
                    {
                        var user1id = Convert.ToInt32(arr[0]);
                        var user2id = Convert.ToInt32(arr[1]);
                        var res = new
                        {
                            chat = (from c in dbContext.SessionChat
                                    where (c.SenderId == user1id && c.ReceiverId == user2id)
                                    || (c.SenderId == user2id && c.ReceiverId == user1id)
                                    select new
                                    {
                                        c.SenderId,
                                        c.ReceiverId,
                                        SenderName = dbContext.User.Where(a => a.UserId == c.SenderId).Select(a => a.UserName).FirstOrDefault(),
                                        ReceiverName = dbContext.User.Where(a => a.UserId == c.ReceiverId).Select(a => a.UserName).FirstOrDefault(),
                                        c.SentText,
                                        c.SentTime,
                                    }).ToList(),

                            call = (from st in dbContext.SessionTxns
                                    join si in (from c in dbContext.SessionUserTxns
                                                where (c.SessionOwnerId == user1id && c.UserId == user2id)
                                                || (c.SessionOwnerId == user2id && c.UserId == user1id)
                                                select c.SessionId).Distinct().ToList()
                                                on st.SessionId equals si
                                    select new
                                    {
                                        StartTime = st.CreatedOn,
                                        st.EndTime
                                    }).ToList()
                        };
                        responseData.Results = res;
                    }
                    else
                    {
                        responseData.Results = "user";
                    }
                }
                #endregion
                #region Check username and password for login
                else if (reqType == "check-user")
                {
                    if (username != "" || password != "")
                    {
                        var user = (from u in dbContext.User
                                    where u.UserName == username && u.Password == password
                                    select new
                                    {
                                        u.UserId,
                                        u.UserName,
                                        u.IsActive,
                                        u.Role,
                                        u.CreatedOn
                                    }).FirstOrDefault();
                        if (user != null)
                        {
                            responseData.Results = user;
                        }
                        else
                        {
                            responseData.ErrorMessage = "Username or Password is wrong!!";
                        }
                    }
                    else
                    {
                        responseData.ErrorMessage = "Username or Password is wrong!!";
                    }
                }
                #endregion
                #region get assessment
                else if (reqType == "get-assessment")
                {
                    var user1id = 0;
                    var user2id = 0;
                    var arr = useridlist.Split(',');
                    if (arr.Length == 2)
                    {
                        user1id = Convert.ToInt32(arr[0]);
                        user2id = Convert.ToInt32(arr[1]);
                        var sessionlist = (from sl in dbContext.SessionUserTxns.AsEnumerable()
                                           where (sl.SessionOwnerId == user1id
                                           && sl.UserId == user2id)
                                           || (sl.UserId == user1id
                                           && sl.SessionOwnerId == user2id)
                                           select sl.SessionId).Distinct().ToList();

                        var note = (from n in dbContext.Assessment.AsEnumerable()
                                    join sl in sessionlist on n.SessionId equals sl
                                    select n).ToList();
                        responseData.Results = note;
                    }
                    else
                    {
                        responseData.Results = "not found";
                    }
                }
                #endregion
                #region get complain
                else if (reqType == "get-complain")
                {
                    var user1id = 0;
                    var user2id = 0;
                    var arr = useridlist.Split(',');
                    if (arr.Length == 2)
                    {
                        user1id = Convert.ToInt32(arr[0]);
                        user2id = Convert.ToInt32(arr[1]);
                        var sessionlist = (from sl in dbContext.SessionUserTxns.AsEnumerable()
                                           where (sl.SessionOwnerId == user1id
                                           && sl.UserId == user2id)
                                           || (sl.UserId == user1id
                                           && sl.SessionOwnerId == user2id)
                                           select sl.SessionId).Distinct().ToList();

                        var note = (from n in dbContext.Complain.AsEnumerable()
                                    join sl in sessionlist on n.SessionId equals sl
                                    select n).ToList();
                        responseData.Results = note;
                    }
                    else
                    {
                        responseData.Results = "not found";
                    }
                }
                #endregion
                #region get examination
                else if (reqType == "get-examination")
                {
                    var user1id = 0;
                    var user2id = 0;
                    var arr = useridlist.Split(',');
                    if (arr.Length == 2)
                    {
                        user1id = Convert.ToInt32(arr[0]);
                        user2id = Convert.ToInt32(arr[1]);
                        var sessionlist = (from sl in dbContext.SessionUserTxns.AsEnumerable()
                                           where (sl.SessionOwnerId == user1id
                                           && sl.UserId == user2id)
                                           || (sl.UserId == user1id
                                           && sl.SessionOwnerId == user2id)
                                           select sl.SessionId).Distinct().ToList();

                        var note = (from n in dbContext.Examination.AsEnumerable()
                                    join sl in sessionlist on n.SessionId equals sl
                                    select n).ToList();
                        responseData.Results = note;
                    }
                    else
                    {
                        responseData.Results = "not found";
                    }
                }
                #endregion
                #region get orders
                else if (reqType == "get-orders")
                {
                    var user1id = 0;
                    var user2id = 0;
                    var arr = useridlist.Split(',');
                    if (arr.Length == 2)
                    {
                        user1id = Convert.ToInt32(arr[0]);
                        user2id = Convert.ToInt32(arr[1]);
                        var sessionlist = (from sl in dbContext.SessionUserTxns.AsEnumerable()
                                           where (sl.SessionOwnerId == user1id
                                           && sl.UserId == user2id)
                                           || (sl.UserId == user1id
                                           && sl.SessionOwnerId == user2id)
                                           select sl.SessionId).Distinct().ToList();

                        var note = (from n in dbContext.Order.AsEnumerable()
                                    join sl in sessionlist on n.SessionId equals sl
                                    select n).ToList();
                        responseData.Results = note;
                    }
                    else
                    {
                        responseData.Results = "not found";
                    }
                }
                #endregion
                #region get plan
                else if (reqType == "get-plan")
                {
                    var user1id = 0;
                    var user2id = 0;
                    var arr = useridlist.Split(',');
                    if (arr.Length == 2)
                    {
                        user1id = Convert.ToInt32(arr[0]);
                        user2id = Convert.ToInt32(arr[1]);
                        var sessionlist = (from sl in dbContext.SessionUserTxns.AsEnumerable()
                                           where (sl.SessionOwnerId == user1id
                                           && sl.UserId == user2id)
                                           || (sl.UserId == user1id
                                           && sl.SessionOwnerId == user2id)
                                           select sl.SessionId).Distinct().ToList();

                        var note = (from n in dbContext.Plan.AsEnumerable()
                                    join sl in sessionlist on n.SessionId equals sl
                                    select n).ToList();
                        responseData.Results = note;
                    }
                    else
                    {
                        responseData.Results = "not found";
                    }
                }
                #endregion
               #region Get Consult requests
               else if (reqType == "get-consult-request")
               {
                   var sessionlist = GetSessionIdList(dbContext, useridlist);
                   var note = (from n in dbContext.ConsultRequest.AsEnumerable()
                               join sl in sessionlist on n.SessionId equals sl
                               select n).ToList();
                   responseData.Results = note;
               }
               #endregion
                #region get session file
                else if (reqType == "get-document-list")
                {
                    var sessionlist = GetSessionIdList(dbContext, useridlist);

                    var doclist = (from sd in dbContext.SessionDocument.AsEnumerable()
                                   join sl in sessionlist on sd.SessionId equals sl
                                   select new
                                   {
                                       sd.SessionDocumentId,
                                       sd.SessionId,
                                       sd.FileName,
                                       sd.UploadedOn,
                                       sd.UploadedBy,
                                       //UploaderName = GetUserName(dbContext, sd.UploadedBy)
                                   }).ToList();
                    List<SessionDocumentsModel> docs = new List<SessionDocumentsModel>();
                    doclist.ForEach(a =>
                    {
                        var doc = new SessionDocumentsModel();
                        doc.SessionDocumentId = a.SessionDocumentId;
                        doc.SessionId = a.SessionId;
                        doc.FileName = a.FileName;
                        doc.UploadedOn = a.UploadedOn;
                        doc.UploaderName = GetUserName(dbContext, a.UploadedBy);
                        docs.Add(doc);
                    });
                    responseData.Results = docs;
                }
                else if (reqType == "get-document")
                {
                    var file = (from d in dbContext.SessionDocument
                                where d.SessionDocumentId == documentid
                                select new
                                {
                                    d.FileName,
                                    d.FileExtension,
                                    d.FileByteArray
                                }).FirstOrDefault();
                    responseData.Results = file;
                }
                #endregion
                #region check valid conference for join 
                else if (reqType == "check-valid-conference")
                {
                    var res = (from c in dbContext.Conference
                               where c.ConferenceRoomId == sessionid
                               select c.ConferenceRoomId).FirstOrDefault();
                    if (res != null)
                    {
                        responseData.Results = true;
                    }
                    else
                    {
                        responseData.Results = false;
                    }
                }
                #endregion
                #region get user details
                else if (reqType == "get-user")
                {
                    var user = (from u in dbContext.User
                                where u.UserId == userid
                                select new
                                {
                                    u.UserId,
                                    u.UserName,
                                    u.IsActive,
                                    u.Role
                                }).FirstOrDefault();
                    if (user != null)
                    {
                        responseData.Results = user;
                    }
                }
                #endregion
                #region get user contacts
                else if (reqType == "get-user-contacts")
                {
                    var contacts = (from uc in dbContext.UserContacts
                                    join u in dbContext.User on uc.ContactId equals u.UserId
                                    where uc.UserId == userid
                                    select new
                                    {
                                        uc.UserId,
                                        uc.ContactId,
                                        ContactName = u.UserName
                                    }).ToList();
                    responseData.Results = contacts;
                }
                #endregion
                #region get user list
                else if (reqType == "get-user-list")
                {
                    var users = (from u in dbContext.User
                                 where u.IsActive == true
                                 select new
                                 {
                                     u.UserId,
                                     u.UserName,
                                     u.Role,
                                     u.IsActive
                                 }).ToList();
                    responseData.Results = users;
                    responseData.Status = "OK";
                }
                #endregion
                #region get previous meetings
                else if (reqType == "get-previous-meetings")
                {
                    var meetings = (from m in dbContext.Conference
                                    where m.CreatedBy == userid
                                    orderby m.ConferenceId descending
                                    select m).ToList();
                    responseData.Results = meetings;
                }
                else if (reqType == "get-meeting-details")
                {
                    var meeting = (from c in dbContext.Conference
                                   where c.ConferenceId == conferenceid
                                   select new
                                   {
                                       ConnectedUsers = (from cu in dbContext.ConferenceUser
                                                         where cu.ConferenceRoomId == c.ConferenceRoomId
                                                         select cu).ToList(),
                                       ConferenceChat = (from cc in dbContext.ConferenceChat
                                                         where cc.ConferenceRoomId == c.ConferenceRoomId
                                                         select cc).ToList()
                                   }).FirstOrDefault();
                    responseData.Results = meeting;
                }
                #endregion
                else
                {
                    responseData.Results = "Request Type not found";
                }
                responseData.Status = "OK";
            }
            catch (Exception ex)
            {
                responseData.Status = "Failed";
                responseData.ErrorMessage = ex.Message + " exception details:" + ex.ToString();
            }
            return DanpheJSONConvert.SerializeObject(responseData, true);
        }


        // POST api/values
        [HttpPost]
        public string Post()
        {
            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();
            //DanpheTeleMedDbContext dbContext = new DanpheTeleMedDbContext(connString);
            responseData.Status = "OK";
            try
            {
                string str = new StreamReader(Request.Body).ReadToEnd();
                string reqType = Request.Query["reqType"];
                responseData.Results = str + reqType;
                #region Save User
                if (reqType == "save-user")
                {
                    UserModel user = DanpheJSONConvert.DeserializeObject<UserModel>(str);
                    if (user != null)
                    {
                        var usr = dbContext.User.Where(u => u.UserName == user.UserName).Select(a => a).ToList();
                        if (usr.Count > 0)
                        {
                            responseData.Status = "Falied";
                            responseData.ErrorMessage = "User already exits";
                        }
                        else
                        {
                            dbContext.User.Add(user);
                            dbContext.SaveChanges();
                            responseData.Results = user;
                            responseData.Status = "OK";
                        }
                    }
                    else
                    {
                        responseData.Status = "Failed";
                        responseData.ErrorMessage = "user information not received";
                    }
                }
                #endregion
                #region Save Conference
                else if (reqType == "save-new-conference")
                {
                    ConferenceModel conference = DanpheJSONConvert.DeserializeObject<ConferenceModel>(str);
                    if (conference != null)
                    {
                        ConferenceUserModel conferenceUser = new ConferenceUserModel();
                        conferenceUser.ConferenceRoomId = conference.ConferenceRoomId;
                        conferenceUser.UserName = GetUserName(dbContext, conference.CreatedBy);
                        conferenceUser.JoinTime = conference.CreatedOn;

                        dbContext.Conference.Add(conference);
                        dbContext.ConferenceUser.Add(conferenceUser);
                        dbContext.SaveChanges();
                        responseData.Results = conference;
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region Add new user in conference
                else if (reqType == "add-conference-user")
                {
                    ConferenceUserModel conferenceUser = DanpheJSONConvert.DeserializeObject<ConferenceUserModel>(str);
                    if (conferenceUser != null)
                    {
                        dbContext.ConferenceUser.Add(conferenceUser);
                        dbContext.SaveChanges();
                        responseData.Results = conferenceUser;
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region Save conference chat
                else if (reqType == "save-conference-chat")
                {
                    ConferenceChatModel conferenceChat = DanpheJSONConvert.DeserializeObject<ConferenceChatModel>(str);
                    if (conferenceChat != null)
                    {
                        dbContext.ConferenceChat.Add(conferenceChat);
                        dbContext.SaveChanges();
                        responseData.Results = conferenceChat;
                        responseData.Results = "OK";
                    }
                }
                #endregion
                #region Save new session of p2p connection
                else if (reqType == "save-new-session")
                {
                    SessionTxnModel sessionTxn = DanpheJSONConvert.DeserializeObject<SessionTxnModel>(str);
                    if (sessionTxn != null)
                    {
                        dbContext.SessionTxns.Add(sessionTxn);
                        dbContext.SaveChanges();
                        SessionUserTxnModel sessionUserTxn = new SessionUserTxnModel();
                        sessionUserTxn.SessionId = sessionTxn.SessionId;
                        sessionUserTxn.SessionOwnerId = sessionTxn.CreatedBy;
                        sessionUserTxn.OwnerJoinTime = sessionTxn.CreatedOn;
                        dbContext.SessionUserTxns.Add(sessionUserTxn);
                        dbContext.SaveChanges();
                        responseData.Results = "OK";
                    }
                }
                #endregion
                #region Add new user in p2p session
                else if (reqType == "add-session-user")
                {
                    SessionUserTxnModel sessionUserTxn = DanpheJSONConvert.DeserializeObject<SessionUserTxnModel>(str);
                    if (sessionUserTxn != null)
                    {
                        if (sessionUserTxn.SessionOwnerId > 0)
                        {
                            dbContext.SessionUserTxns.Add(sessionUserTxn);
                            dbContext.SaveChanges();
                        }
                        else
                        {
                            var newuser = (from u in dbContext.SessionUserTxns
                                           where u.SessionId == sessionUserTxn.SessionId
                                           select u).FirstOrDefault();
                            newuser.UserId = sessionUserTxn.UserId;
                            newuser.UserJoinTime = sessionUserTxn.UserJoinTime;
                            dbContext.SessionUserTxns.Attach(newuser);
                            dbContext.Entry(newuser).Property(a => a.UserId).IsModified = true;
                            dbContext.Entry(newuser).Property(a => a.UserJoinTime).IsModified = true;
                            dbContext.Entry(newuser).State = EntityState.Modified;
                            dbContext.SaveChanges();
                        }
                    }
                    responseData.Results = sessionUserTxn;
                    responseData.Results = "OK";
                }
                #endregion
                #region Save session chat in p2p connection
                else if (reqType == "save-session-chat")
                {
                    SessionChatModel sessionChat = DanpheJSONConvert.DeserializeObject<SessionChatModel>(str);
                    if (sessionChat != null)
                    {
                        var schat = (from s in dbContext.SessionUserTxns
                                     where s.SessionId == sessionChat.SessionId
                                     select new
                                     {
                                         s.SessionOwnerId,
                                         s.UserId
                                     }).FirstOrDefault();
                        sessionChat.ReceiverId = (schat.UserId == sessionChat.SenderId) ? schat.SessionOwnerId : schat.UserId;
                        dbContext.SessionChat.Add(sessionChat);
                        dbContext.SaveChanges();
                        responseData.Results = sessionChat;
                        responseData.Results = "OK";
                    }
                }
                #endregion
                #region save assessment
                else if (reqType == "save-assessment")
                {
                    ClinicalAssessmentModel assessment = DanpheJSONConvert.DeserializeObject<ClinicalAssessmentModel>(str);
                    if (assessment != null)
                    {
                        dbContext.Assessment.Add(assessment);
                        dbContext.SaveChanges();
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region save complain
                else if (reqType == "save-complain")
                {
                    ClinicalComplainModel complain = DanpheJSONConvert.DeserializeObject<ClinicalComplainModel>(str);
                    if (complain != null)
                    {
                        dbContext.Complain.Add(complain);
                        dbContext.SaveChanges();
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region save examination
                else if (reqType == "save-examination")
                {
                    ClinicalExaminationModel examination = DanpheJSONConvert.DeserializeObject<ClinicalExaminationModel>(str);
                    if (examination != null)
                    {
                        dbContext.Examination.Add(examination);
                        dbContext.SaveChanges();
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region save orders
                else if (reqType == "save-orders")
                {
                    ClinicalOrderModel order = DanpheJSONConvert.DeserializeObject<ClinicalOrderModel>(str);
                    if (order != null)
                    {
                        dbContext.Order.Add(order);
                        dbContext.SaveChanges();
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region save plan
                else if (reqType == "save-plan")
                {
                    ClinicalPlanModel plan = DanpheJSONConvert.DeserializeObject<ClinicalPlanModel>(str);
                    if (plan != null)
                    {
                        dbContext.Plan.Add(plan);
                        dbContext.SaveChanges();
                        responseData.Status = "OK";
                    }
                }
                #endregion
                #region save consult request
               else if (reqType == "save-consult-request")
               {
                   ConsultRequestModel consult = DanpheJSONConvert.DeserializeObject<ConsultRequestModel>(str);
                   if (consult != null)
                   {
                       dbContext.ConsultRequest.Add(consult);
                       dbContext.SaveChanges();
                       responseData.Status = "OK";
                   }
               }
               #endregion
                #region End Video Call
                else if (reqType == "end-video-call")
                {
                    SessionTxnModel sessionTxn = DanpheJSONConvert.DeserializeObject<SessionTxnModel>(str);
                    var es = (from st in dbContext.SessionTxns
                              where st.SessionId == sessionTxn.SessionId
                              select st).FirstOrDefault();
                    if (es != null)
                    {
                        es.EndTime = sessionTxn.EndTime;
                        dbContext.SessionTxns.Attach(es);
                        dbContext.Entry(es).Property(a => a.EndTime).IsModified = true;
                        dbContext.Entry(es).State = EntityState.Modified;
                        dbContext.SaveChanges();
                    }
                    responseData.Results = es;
                    responseData.Results = "OK";
                }
                #endregion
                else
                {
                    responseData.Results = "Wrong data";
                    responseData.Status = "OK";
                }

            }
            catch (Exception ex)
            {
                responseData.Status = "Failed";
                responseData.ErrorMessage = ex.Message + "exception details:" + ex.ToString();
            }
            return DanpheJSONConvert.SerializeObject(responseData, true);
        }


        // PUT api/values
        [HttpPut]
        public string Put()
        {
            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();
            string inputSting = new StreamReader(Request.Body).ReadToEnd();
            try
            {
            }
            catch (Exception ex)
            {
                responseData.Status = "Failed";
                responseData.ErrorMessage = ex.Message;
            }
            return DanpheJSONConvert.SerializeObject(responseData);
        }

        #region Upload file
        //api/DanpheTelemedicine/uploadfile?sessionid=123&senderid=1
        [HttpPost("uploadfile"), DisableRequestSizeLimit]
        public ActionResult UploadFile(string sessionid, int senderid)
        {
            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();
            try
            {
                int[] responseidlist = { };
                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    /////Converting Files to Byte there for we require MemoryStream object
                    using (var ms = new MemoryStream())
                    {
                        string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        ////this is the Extention of Current File(.PNG, .JPEG, .JPG)
                        string fileExtention = Path.GetExtension(file.FileName);
                        ////Copy Each file to MemoryStream
                        file.CopyTo(ms);
                        ////Convert File to Byte[]
                        var fileBytes = ms.ToArray();

                        var tempModel = new SessionDocumentsModel();
                        tempModel.SessionId = sessionid;
                        tempModel.UploadedBy = senderid;
                        tempModel.FileName = fileName;
                        tempModel.UploadedOn = DateTime.Now.ToString();
                        tempModel.FileByteArray = fileBytes;
                        tempModel.FileExtension = fileExtention;

                        dbContext.SessionDocument.Add(tempModel);
                        dbContext.SaveChanges();
                        responseidlist.Append(tempModel.SessionDocumentId);
                    }
                }
                var res = (from d in dbContext.SessionDocument
                           orderby d.SessionDocumentId descending
                           select new
                           {
                               d.SessionDocumentId,
                               d.FileName
                           }).FirstOrDefault();
                responseData.Results = res;
                responseData.Status = "OK";
                //return Json("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                responseData.Status = "Failed";
                responseData.ErrorMessage = "Upload Failed" + ex.Message;
                //return Json("Upload Failed: " + ex.Message);
            }
            return Json(DanpheJSONConvert.SerializeObject(responseData, true));
        }
        #endregion
        string GetUserName(DanpheTeleMedDbContext dbContext, int userId)
        {
            return (from u in dbContext.User
                    where u.UserId == userId
                    select u.UserName).FirstOrDefault();
        }
        int GetUserId(DanpheTeleMedDbContext dbContext, string userName)
        {
            return (from u in dbContext.User
                    where u.UserName == userName
                    select u.UserId).FirstOrDefault();
        }
        List<string> GetSessionIdList(DanpheTeleMedDbContext dbContext, string useridlist)
        {
            var arr = useridlist.Split(',');

            var user1id = Convert.ToInt32(arr[0]);
            var user2id = Convert.ToInt32(arr[1]);

            var sessionlist = (from sl in dbContext.SessionUserTxns.AsEnumerable()
                               where (sl.SessionOwnerId == user1id && sl.UserId == user2id)
                               || (sl.UserId == user1id && sl.SessionOwnerId == user2id)
                               select sl.SessionId).Distinct().ToList();
            return sessionlist;
        }
    }
}
