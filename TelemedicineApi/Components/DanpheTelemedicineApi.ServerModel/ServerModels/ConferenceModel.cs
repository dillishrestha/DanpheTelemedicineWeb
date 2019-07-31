using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class ConferenceModel
    {
        [Key]
        public int ConferenceId { get; set; }
        public string ConferenceRoomId { get; set; }
        public string CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string EndTime { get; set; }
        public string RoomPassword { get; set; }
    }
}
