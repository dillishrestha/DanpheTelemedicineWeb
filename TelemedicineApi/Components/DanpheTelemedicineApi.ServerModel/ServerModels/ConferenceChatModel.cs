using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class ConferenceChatModel
    {
        [Key]
        public int ConferenceChatId { get; set; }
        public string ConferenceRoomId { get; set; }
        public string SenderName { get; set; }
        public string SentTime { get; set; }
        public string SentText { get; set; }
    }
}
