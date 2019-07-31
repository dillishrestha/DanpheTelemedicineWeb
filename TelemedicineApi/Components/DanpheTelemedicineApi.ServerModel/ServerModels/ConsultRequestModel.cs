using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DanpheTelemedicineApi.ServerModel
{
    public class ConsultRequestModel
    {
        [Key]
        public int ConsultRequestId { get; set; }
        public string SessionId { get; set; }
        public int CreatedBy { get; set; }
        public string Notes { get; set; }
    }
}