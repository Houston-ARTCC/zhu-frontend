import { relations } from "drizzle-orm/relations";
import { usersUser, auditlogLogentry, djangoContentType, announcementsAnnouncement, authPermission, authGroupPermissions, authGroup, authtokenToken, connectionsControllersession, connectionsOnlinecontroller, djangoAdminLog, eventsEvent, eventsEventposition, eventsEventscore, eventsPositionshift, eventsSupportrequest, feedbackFeedback, loaLoa, trainingTrainingsession, usersUserGroups, trainingMentoravailability, trainingTrainingrequest, usersUserUserPermissions, visitVisitingapplication, eventsShiftrequest, usersRole, usersUserRoles } from "./schema";

export const auditlogLogentryRelations = relations(auditlogLogentry, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [auditlogLogentry.actorId],
		references: [usersUser.cid]
	}),
	djangoContentType: one(djangoContentType, {
		fields: [auditlogLogentry.contentTypeId],
		references: [djangoContentType.id]
	}),
}));

export const usersUserRelations = relations(usersUser, ({many}) => ({
	auditlogLogentries: many(auditlogLogentry),
	announcementsAnnouncements: many(announcementsAnnouncement),
	authtokenTokens: many(authtokenToken),
	connectionsControllersessions: many(connectionsControllersession),
	connectionsOnlinecontrollers: many(connectionsOnlinecontroller),
	djangoAdminLogs: many(djangoAdminLog),
	eventsEventscores: many(eventsEventscore),
	eventsPositionshifts: many(eventsPositionshift),
	eventsSupportrequests: many(eventsSupportrequest),
	feedbackFeedbacks_controllerId: many(feedbackFeedback, {
		relationName: "feedbackFeedback_controllerId_usersUser_cid"
	}),
	feedbackFeedbacks_pilotId: many(feedbackFeedback, {
		relationName: "feedbackFeedback_pilotId_usersUser_cid"
	}),
	loaLoas: many(loaLoa),
	trainingTrainingsessions_instructorId: many(trainingTrainingsession, {
		relationName: "trainingTrainingsession_instructorId_usersUser_cid"
	}),
	trainingTrainingsessions_studentId: many(trainingTrainingsession, {
		relationName: "trainingTrainingsession_studentId_usersUser_cid"
	}),
	usersUserGroups: many(usersUserGroups),
	trainingMentoravailabilities: many(trainingMentoravailability),
	trainingTrainingrequests: many(trainingTrainingrequest),
	usersUserUserPermissions: many(usersUserUserPermissions),
	visitVisitingapplications: many(visitVisitingapplication),
	eventsShiftrequests: many(eventsShiftrequest),
	usersUserRoles: many(usersUserRoles),
}));

export const djangoContentTypeRelations = relations(djangoContentType, ({many}) => ({
	auditlogLogentries: many(auditlogLogentry),
	authPermissions: many(authPermission),
	djangoAdminLogs: many(djangoAdminLog),
}));

export const announcementsAnnouncementRelations = relations(announcementsAnnouncement, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [announcementsAnnouncement.authorId],
		references: [usersUser.cid]
	}),
}));

export const authPermissionRelations = relations(authPermission, ({one, many}) => ({
	djangoContentType: one(djangoContentType, {
		fields: [authPermission.contentTypeId],
		references: [djangoContentType.id]
	}),
	authGroupPermissions: many(authGroupPermissions),
	usersUserUserPermissions: many(usersUserUserPermissions),
}));

export const authGroupPermissionsRelations = relations(authGroupPermissions, ({one}) => ({
	authPermission: one(authPermission, {
		fields: [authGroupPermissions.permissionId],
		references: [authPermission.id]
	}),
	authGroup: one(authGroup, {
		fields: [authGroupPermissions.groupId],
		references: [authGroup.id]
	}),
}));

export const authGroupRelations = relations(authGroup, ({many}) => ({
	authGroupPermissions: many(authGroupPermissions),
	usersUserGroups: many(usersUserGroups),
}));

export const authtokenTokenRelations = relations(authtokenToken, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [authtokenToken.userId],
		references: [usersUser.cid]
	}),
}));

export const connectionsControllersessionRelations = relations(connectionsControllersession, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [connectionsControllersession.userId],
		references: [usersUser.cid]
	}),
}));

export const connectionsOnlinecontrollerRelations = relations(connectionsOnlinecontroller, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [connectionsOnlinecontroller.userId],
		references: [usersUser.cid]
	}),
}));

export const djangoAdminLogRelations = relations(djangoAdminLog, ({one}) => ({
	djangoContentType: one(djangoContentType, {
		fields: [djangoAdminLog.contentTypeId],
		references: [djangoContentType.id]
	}),
	usersUser: one(usersUser, {
		fields: [djangoAdminLog.userId],
		references: [usersUser.cid]
	}),
}));

export const eventsEventpositionRelations = relations(eventsEventposition, ({one, many}) => ({
	eventsEvent: one(eventsEvent, {
		fields: [eventsEventposition.eventId],
		references: [eventsEvent.id]
	}),
	eventsPositionshifts: many(eventsPositionshift),
}));

export const eventsEventRelations = relations(eventsEvent, ({many}) => ({
	eventsEventpositions: many(eventsEventposition),
	eventsEventscores: many(eventsEventscore),
	feedbackFeedbacks: many(feedbackFeedback),
}));

export const eventsEventscoreRelations = relations(eventsEventscore, ({one}) => ({
	eventsEvent: one(eventsEvent, {
		fields: [eventsEventscore.eventId],
		references: [eventsEvent.id]
	}),
	usersUser: one(usersUser, {
		fields: [eventsEventscore.userId],
		references: [usersUser.cid]
	}),
}));

export const eventsPositionshiftRelations = relations(eventsPositionshift, ({one, many}) => ({
	eventsEventposition: one(eventsEventposition, {
		fields: [eventsPositionshift.positionId],
		references: [eventsEventposition.id]
	}),
	usersUser: one(usersUser, {
		fields: [eventsPositionshift.userId],
		references: [usersUser.cid]
	}),
	eventsShiftrequests: many(eventsShiftrequest),
}));

export const eventsSupportrequestRelations = relations(eventsSupportrequest, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [eventsSupportrequest.userId],
		references: [usersUser.cid]
	}),
}));

export const feedbackFeedbackRelations = relations(feedbackFeedback, ({one}) => ({
	usersUser_controllerId: one(usersUser, {
		fields: [feedbackFeedback.controllerId],
		references: [usersUser.cid],
		relationName: "feedbackFeedback_controllerId_usersUser_cid"
	}),
	eventsEvent: one(eventsEvent, {
		fields: [feedbackFeedback.eventId],
		references: [eventsEvent.id]
	}),
	usersUser_pilotId: one(usersUser, {
		fields: [feedbackFeedback.pilotId],
		references: [usersUser.cid],
		relationName: "feedbackFeedback_pilotId_usersUser_cid"
	}),
}));

export const loaLoaRelations = relations(loaLoa, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [loaLoa.userId],
		references: [usersUser.cid]
	}),
}));

export const trainingTrainingsessionRelations = relations(trainingTrainingsession, ({one}) => ({
	usersUser_instructorId: one(usersUser, {
		fields: [trainingTrainingsession.instructorId],
		references: [usersUser.cid],
		relationName: "trainingTrainingsession_instructorId_usersUser_cid"
	}),
	usersUser_studentId: one(usersUser, {
		fields: [trainingTrainingsession.studentId],
		references: [usersUser.cid],
		relationName: "trainingTrainingsession_studentId_usersUser_cid"
	}),
}));

export const usersUserGroupsRelations = relations(usersUserGroups, ({one}) => ({
	authGroup: one(authGroup, {
		fields: [usersUserGroups.groupId],
		references: [authGroup.id]
	}),
	usersUser: one(usersUser, {
		fields: [usersUserGroups.userId],
		references: [usersUser.cid]
	}),
}));

export const trainingMentoravailabilityRelations = relations(trainingMentoravailability, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [trainingMentoravailability.userId],
		references: [usersUser.cid]
	}),
}));

export const trainingTrainingrequestRelations = relations(trainingTrainingrequest, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [trainingTrainingrequest.userId],
		references: [usersUser.cid]
	}),
}));

export const usersUserUserPermissionsRelations = relations(usersUserUserPermissions, ({one}) => ({
	authPermission: one(authPermission, {
		fields: [usersUserUserPermissions.permissionId],
		references: [authPermission.id]
	}),
	usersUser: one(usersUser, {
		fields: [usersUserUserPermissions.userId],
		references: [usersUser.cid]
	}),
}));

export const visitVisitingapplicationRelations = relations(visitVisitingapplication, ({one}) => ({
	usersUser: one(usersUser, {
		fields: [visitVisitingapplication.userId],
		references: [usersUser.cid]
	}),
}));

export const eventsShiftrequestRelations = relations(eventsShiftrequest, ({one}) => ({
	eventsPositionshift: one(eventsPositionshift, {
		fields: [eventsShiftrequest.shiftId],
		references: [eventsPositionshift.id]
	}),
	usersUser: one(usersUser, {
		fields: [eventsShiftrequest.userId],
		references: [usersUser.cid]
	}),
}));

export const usersUserRolesRelations = relations(usersUserRoles, ({one}) => ({
	usersRole: one(usersRole, {
		fields: [usersUserRoles.roleId],
		references: [usersRole.id]
	}),
	usersUser: one(usersUser, {
		fields: [usersUserRoles.userId],
		references: [usersUser.cid]
	}),
}));

export const usersRoleRelations = relations(usersRole, ({many}) => ({
	usersUserRoles: many(usersUserRoles),
}));