using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DanpheTelemedicineApi.ServerModel;
using Microsoft.EntityFrameworkCore;

namespace DanpheTelemedicineApi.DalLayer
{
    public class DanpheTeleMedDbContext : DbContext
    {

        public DanpheTeleMedDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<ClinicalAssessmentModel> Assessment { get; set; }
        public DbSet<ClinicalComplainModel> Complain { get; set; }
        public DbSet<ClinicalExaminationModel> Examination { get; set; }
        public DbSet<ClinicalOrderModel> Order { get; set; }
        public DbSet<ClinicalPlanModel> Plan { get; set; }
        public DbSet<ConsultRequestModel> ConsultRequest { get; set; }
        public DbSet<ConferenceChatModel> ConferenceChat { get; set; }
        public DbSet<ConferenceModel> Conference { get; set; }
        public DbSet<ConferenceUserModel> ConferenceUser { get; set; }
        public DbSet<SessionChatModel> SessionChat { get; set; }
        public DbSet<SessionDocumentsModel> SessionDocument { get; set; }
        public DbSet<SessionTxnModel> SessionTxns { get; set; }
        public DbSet<SessionUserTxnModel> SessionUserTxns { get; set; }
        public DbSet<UserModel> User { get; set; }
        public DbSet<UserContactsModel> UserContacts { get; set; }
        public DbSet<SysAdminParameters> Parameters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClinicalAssessmentModel>().ToTable("CLN_Assessment");
            modelBuilder.Entity<ClinicalComplainModel>().ToTable("CLN_Complain");
            modelBuilder.Entity<ClinicalExaminationModel>().ToTable("CLN_Examination");
            modelBuilder.Entity<ClinicalOrderModel>().ToTable("CLN_Order");
            modelBuilder.Entity<ClinicalPlanModel>().ToTable("CLN_Plan");
            modelBuilder.Entity<ConsultRequestModel>().ToTable("Consult_Request");
            modelBuilder.Entity<ConferenceChatModel>().ToTable("ConferenceChat");
            modelBuilder.Entity<ConferenceModel>().ToTable("Conference");
            modelBuilder.Entity<ConferenceUserModel>().ToTable("ConferenceUser");
            modelBuilder.Entity<SessionChatModel>().ToTable("SessionChat");
            modelBuilder.Entity<SessionDocumentsModel>().ToTable("SessionDocuments");
            modelBuilder.Entity<SessionTxnModel>().ToTable("SessionTxn");
            modelBuilder.Entity<SessionUserTxnModel>().ToTable("SessionUserTxn");
            modelBuilder.Entity<UserModel>().ToTable("User");
            modelBuilder.Entity<UserContactsModel>().ToTable("UserContacts");
            modelBuilder.Entity<SysAdminParameters>().ToTable("SysAdmin_Parameters");
        }
    }
}