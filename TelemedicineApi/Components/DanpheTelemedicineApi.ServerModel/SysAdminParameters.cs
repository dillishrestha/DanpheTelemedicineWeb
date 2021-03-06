﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DanpheTelemedicineApi.ServerModel
{
    public class SysAdminParameters
    {
        [Key]
        public int ParameterId { get; set; }
        public string ParameterGroupName { get; set; }
        public string ParameterName { get; set; }
        public string ParameterValue { get; set; }
        public string ValueDataType { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool? IsActive { get; set; }
    }
}
