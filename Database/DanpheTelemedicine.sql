USE [master]
GO

IF db_id('DanpheTelemedicine') is not null
BEGIN
  ALTER DATABASE [DanpheTelemedicine] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
  DROP DATABASE [DanpheTelemedicine]
END
GO
CREATE DATABASE [DanpheTelemedicine]
GO
USE [DanpheTelemedicine]
GO
/****** Object:  Table [dbo].[User] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](50) UNIQUE NULL,
	[Password] [varchar](max) NULL,
	[CreatedOn] [varchar](max) NULL,
	[Role] [varchar](max) NULL,
	[IsActive] [bit] NULL
 CONSTRAINT [PK_UserId] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Conference] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Conference](
	[ConferenceId] [int] IDENTITY(1,1) NOT NULL,
	[ConferenceRoomId] [varchar](max) NULL,
	[CreatedOn] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[EndTime] [varchar](max) NULL,
	[RoomPassword] [varchar](max) NULL
 CONSTRAINT [PK_ConferenceId] PRIMARY KEY CLUSTERED 
(
	[ConferenceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConferenceUser] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConferenceUser](
	[ConferenceUserId] [int] IDENTITY(1,1) NOT NULL,
	[ConferenceRoomId] [varchar](max) NULL,
	[UserName] [varchar](max) NULL,
	[JoinTime] [varchar](max) NULL,
	[LeftTime] [varchar](max) NULL,
 CONSTRAINT [PK_ConferenceUserId] PRIMARY KEY CLUSTERED 
(
	[ConferenceUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConferenceChat] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConferenceChat](
	[ConferenceChatId] [int] IDENTITY(1,1) NOT NULL,
	[ConferenceRoomId] [varchar](max) NULL,
	[SenderName] [varchar](max) NULL,
	[SentTime] [varchar](max) NULL,
	[SentText] [varchar](max) NULL
 CONSTRAINT [PK_ConferenceChatId] PRIMARY KEY CLUSTERED 
(
	[ConferenceChatId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SessionTxn] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionTxn](
	[SessionTxnId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[SessionDisplayId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[CreatedOn] [varchar](max) NULL,
	[CallingTo] [int] NULL,
	[EndTime] [varchar](max) NULL
 CONSTRAINT [PK_SessionTxnId] PRIMARY KEY CLUSTERED 
(
	[SessionTxnId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SessionUserTxn] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionUserTxn](
	[SessionUserTxnId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[UserId] [int] NULL,
	[UserJoinTime] [varchar](max) NULL,
	[LeftTime] [varchar](max) NULL,
	[SessionOwnerId] [int] NULL,
	[OwnerJoinTime] [varchar](max) NULL
 CONSTRAINT [PK_SessionUserTxnId] PRIMARY KEY CLUSTERED 
(
	[SessionUserTxnId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SessionChat] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionChat](
	[SessionChatId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[SenderId] [int] NULL,
	[ReceiverId] [int] NULL,
	[SentTime] [varchar](max) NULL,
	[IsRead] [bit] NULL,
	[SentText] [varchar](max) NULL
 CONSTRAINT [PK_SessionChatId] PRIMARY KEY CLUSTERED 
(
	[SessionChatId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SessionDocuments] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionDocuments](
	[SessionDocumentId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[UploadedBy] [int] NULL,
	[UploadedOn] [varchar](max) NULL,
	[IsRead] [bit] NULL,
	[FileName] [varchar](max) NULL,
	[FileByteArray] [varbinary](max) NULL,
	[FileExtension] [varchar](max) NULL
 CONSTRAINT [PK_SessionDocument] PRIMARY KEY CLUSTERED 
(
	[SessionDocumentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CLN_Complain] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLN_Complain](
	[CLNComplainId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[Notes] [varchar](max) NULL,
 CONSTRAINT [PK_CLNComplainId] PRIMARY KEY CLUSTERED 
(
	[CLNComplainId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CLN_Examination] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLN_Examination](
	[CLNExaminationId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[Notes] [varchar](max) NULL,
 CONSTRAINT [PK_CLNExaminationId] PRIMARY KEY CLUSTERED 
(
	[CLNExaminationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CLN_Assessment] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLN_Assessment](
	[CLNAssessmentId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[Notes] [varchar](max) NULL,
 CONSTRAINT [PK_CLNAssessmentId] PRIMARY KEY CLUSTERED 
(
	[CLNAssessmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CLN_Plan] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLN_Plan](
	[CLNPlanId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[Notes] [varchar](max) NULL,
 CONSTRAINT [PK_CLNPlanId] PRIMARY KEY CLUSTERED 
(
	[CLNPlanId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CLN_Order] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLN_Order](
	[CLNOrderId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[Notes] [varchar](max) NULL,
 CONSTRAINT [PK_CLNOrderd] PRIMARY KEY CLUSTERED 
(
	[CLNOrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserContacts] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserContacts](
	[UserContactId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[ContactId] [int] NULL,
	[IsActive] [bit] NULL
 CONSTRAINT [PK_UserContactId] PRIMARY KEY CLUSTERED 
(
	[UserContactId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Consult_Request] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Consult_Request](
	[ConsultRequestId] [int] IDENTITY(1,1) NOT NULL,
	[SessionId] [varchar](max) NULL,
	[CreatedBy] [int] NULL,
	[Notes] [varchar](max) NULL,
 CONSTRAINT [PK_ConsultRequestId] PRIMARY KEY CLUSTERED 
(
	[ConsultRequestId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Object:  Table [dbo].[SysAdmin_Parameters] ******/
CREATE TABLE [dbo].[SysAdmin_Parameters](
	[ParameterId] [int] IDENTITY(1,1) NOT NULL,
	[ParameterGroupName] [varchar](100) NULL,
	[ParameterName] [varchar](200) NULL,
	[ParameterValue] [varchar](max) NULL,
	[ValueDataType] [varchar](50) NULL,
	[Description] [varchar](1000) NULL,
	[CreatedOn] [datetime] NULL,
	[IsActive] [bit] NULL
PRIMARY KEY CLUSTERED 
(
	[ParameterId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UK_Core_CFG_Parameters] UNIQUE NONCLUSTERED 
(
	[ParameterGroupName] ASC,
	[ParameterName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT [dbo].[SysAdmin_Parameters]
 ([ParameterGroupName], [ParameterName], [ParameterValue], [ValueDataType], [Description], [CreatedOn], [IsActive])
 VALUES (N'common',
 N'iceServer',
 N'{"iceServers":[{"urls":["stun:bturn1.xirsys1221.com"]},{"username":"9hiaOVYRRn31s_Lv2sGS-iGgtEKg5_3SVWfeEZyO-4GWtKxUv0sCxQVNGkxlk-zBAAAAAF0sGiFhamF5cGF0aWw=","credential":"04f626c0-a6c8-11e9-8ad1-26d3ed601a80","urls":["turn:bturn1.xirsys.com:80?transport=udp","turn:bturn1.xirsys.com:3478?transport=udp","turn:bturn1.xirsys.com:80?transport=tcp","turn:bturn1.xirsys.com:3478?transport=tcp","turns:bturn1.xirsys.com:443?transport=tcp","turns:bturn1.xirsys.com:5349?transport=tcp"]}]}',
 N'json',
 NULL,
 GETDATE(),
 1)
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TRIGGER TRG_Update_Contacts 
   ON  [User]
   AFTER INSERT
AS 
BEGIN

  insert into UserContacts
  ([UserId],[ContactId],[IsActive])
	(select
		(select UserId from inserted) as USerId, 
		UserId as ContactId,
		1 as ISActive
	from [User] where userId != (select UserId from inserted))

	 insert into UserContacts
  ([UserId],[ContactId],[IsActive])
	(select
		UserId as UserId, 
		(select UserId from inserted) as ContactId,
		1 as ISActive
	from [User] where userId != (select UserId from inserted))

END
GO


/**************************/
/*inserting sample records for demo*/
/*inserting users*/
INSERT INTO [User] ([UserName],[Password],[CreatedOn],[Role],[IsActive])
VALUES	('doctor1','pass123',GETDATE(),'doctor',1)
GO

INSERT INTO [User] ([UserName],[Password],[CreatedOn],[Role],[IsActive])
VALUES	('patient1','pass123',GETDATE(),'patient',1)
GO
