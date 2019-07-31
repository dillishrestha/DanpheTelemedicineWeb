
using System.ComponentModel.DataAnnotations;

namespace DanpheTelemedicineApi.ServerModel
{
    public class ConferenceUserModel
    {
        [Key]
        public int ConferenceUserId { get; set; }
        public string ConferenceRoomId { get; set; }
        public string UserName { get; set; }
        public string JoinTime { get; set; }
        public string LeftTime { get; set; }
    }
}
