using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class ClinicalExaminationModel
    {
        [Key]
        public int CLNExaminationId { get; set; }
        public string SessionId { get; set; }
        public int CreatedBy { get; set; }
        public string Notes { get; set; }
    }
}
