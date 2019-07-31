using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class ClinicalPlanModel
    {
        [Key]
        public int CLNPlanId { get; set; }
        public string SessionId { get; set; }
        public int CreatedBy { get; set; }
        public string Notes { get; set; }
    }
}
