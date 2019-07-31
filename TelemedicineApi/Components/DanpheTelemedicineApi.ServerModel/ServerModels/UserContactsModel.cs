using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class UserContactsModel
    {
        [Key]
        public int UserContactId { get; set; }
        public int UserId { get; set; }
        public int ContactId { get; set; }
        public bool? IsActive { get; set; }
    }
}
