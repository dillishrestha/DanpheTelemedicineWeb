using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class SessionChatModel
    {
        [Key]
        public int SessionChatId { get; set; }
        public string SessionId { get; set; }
        public int? SenderId { get; set; }
        public int? ReceiverId { get; set; }
        public string SentTime { get; set; }
        public bool? IsRead { get; set; }
        public string SentText { get; set; }
    }
}
