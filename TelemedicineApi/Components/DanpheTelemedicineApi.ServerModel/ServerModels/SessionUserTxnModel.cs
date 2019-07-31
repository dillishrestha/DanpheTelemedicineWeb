using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class SessionUserTxnModel
    {
        [Key]
        public int SessionUserTxnId { get; set; }
        public string SessionId { get; set; }
        public int UserId { get; set; }
        public string UserJoinTime { get; set; }
        public string LeftTime { get; set; }
        public int SessionOwnerId { get; set; }
        public string OwnerJoinTime { get; set; }
    }
}
