using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class SessionTxnModel
    {
        [Key]
        public int SessionTxnId { get; set; }
        public string SessionId { get; set; }
        public string SessionDisplayId { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public int CallingTo { get; set; }
        public string EndTime { get; set; }
    }
}
