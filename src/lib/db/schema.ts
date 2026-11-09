import { pgTable, index, foreignKey, check, integer, varchar, bigint, text, smallint, timestamp, inet, jsonb, unique, boolean, interval, date, time } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const auditlogLogentry = pgTable("auditlog_logentry", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auditlog_logentry_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	objectPk: varchar("object_pk", { length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	objectId: bigint("object_id", { mode: "number" }),
	objectRepr: text("object_repr").notNull(),
	action: smallint().notNull(),
	changes: text().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	actorId: integer("actor_id"),
	contentTypeId: integer("content_type_id").notNull(),
	remoteAddr: inet("remote_addr"),
	additionalData: jsonb("additional_data"),
	serializedData: jsonb("serialized_data"),
}, (table) => [
	index("auditlog_logentry_action_229afe39").using("btree", table.action.asc().nullsLast().op("int2_ops")),
	index("auditlog_logentry_actor_id_959271d2").using("btree", table.actorId.asc().nullsLast().op("int4_ops")),
	index("auditlog_logentry_content_type_id_75830218").using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
	index("auditlog_logentry_object_id_09c2eee8").using("btree", table.objectId.asc().nullsLast().op("int8_ops")),
	index("auditlog_logentry_object_pk_6e3219c0").using("btree", table.objectPk.asc().nullsLast().op("text_ops")),
	index("auditlog_logentry_object_pk_6e3219c0_like").using("btree", table.objectPk.asc().nullsLast().op("varchar_pattern_ops")),
	index("auditlog_logentry_timestamp_37867bb0").using("btree", table.timestamp.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [usersUser.cid],
			name: "auditlog_logentry_actor_id_959271d2_fk_users_user_cid"
		}),
	foreignKey({
			columns: [table.contentTypeId],
			foreignColumns: [djangoContentType.id],
			name: "auditlog_logentry_content_type_id_75830218_fk_django_co"
		}),
	check("auditlog_logentry_action_check", sql`action >= 0`),
]);

export const djangoContentType = pgTable("django_content_type", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "django_content_type_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	appLabel: varchar("app_label", { length: 100 }).notNull(),
	model: varchar({ length: 100 }).notNull(),
}, (table) => [
	unique("django_content_type_app_label_model_76bd3d3b_uniq").on(table.appLabel, table.model),
]);

export const eventsEvent = pgTable("events_event", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_event_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 128 }).notNull(),
	banner: varchar({ length: 200 }),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	host: varchar({ length: 64 }).notNull(),
	description: text(),
	hidden: boolean().notNull(),
});

export const djangoMigrations = pgTable("django_migrations", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "django_migrations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	app: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	applied: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const djangoSession = pgTable("django_session", {
	sessionKey: varchar("session_key", { length: 40 }).primaryKey().notNull(),
	sessionData: text("session_data").notNull(),
	expireDate: timestamp("expire_date", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("django_session_expire_date_a5c62663").using("btree", table.expireDate.asc().nullsLast().op("timestamptz_ops")),
	index("django_session_session_key_c0390e0f_like").using("btree", table.sessionKey.asc().nullsLast().op("varchar_pattern_ops")),
]);

export const announcementsAnnouncement = pgTable("announcements_announcement", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "announcements_announcement_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: varchar({ length: 128 }).notNull(),
	body: text().notNull(),
	posted: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	authorId: integer("author_id"),
}, (table) => [
	index("announcements_announcement_author_id_47b59c69").using("btree", table.authorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersUser.cid],
			name: "announcements_announcement_author_id_47b59c69_fk_users_user_cid"
		}),
]);

export const authPermission = pgTable("auth_permission", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auth_permission_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	contentTypeId: integer("content_type_id").notNull(),
	codename: varchar({ length: 100 }).notNull(),
}, (table) => [
	index("auth_permission_content_type_id_2f476e4b").using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.contentTypeId],
			foreignColumns: [djangoContentType.id],
			name: "auth_permission_content_type_id_2f476e4b_fk_django_co"
		}),
	unique("auth_permission_content_type_id_codename_01ab375a_uniq").on(table.contentTypeId, table.codename),
]);

export const authGroupPermissions = pgTable("auth_group_permissions", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auth_group_permissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	groupId: integer("group_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	index("auth_group_permissions_group_id_b120cbf9").using("btree", table.groupId.asc().nullsLast().op("int4_ops")),
	index("auth_group_permissions_permission_id_84c5c92e").using("btree", table.permissionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [authPermission.id],
			name: "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm"
		}),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [authGroup.id],
			name: "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id"
		}),
	unique("auth_group_permissions_group_id_permission_id_0cd325b0_uniq").on(table.groupId, table.permissionId),
]);

export const authGroup = pgTable("auth_group", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "auth_group_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 150 }).notNull(),
}, (table) => [
	index("auth_group_name_a6ea08ec_like").using("btree", table.name.asc().nullsLast().op("varchar_pattern_ops")),
	unique("auth_group_name_key").on(table.name),
]);

export const authtokenToken = pgTable("authtoken_token", {
	key: varchar({ length: 40 }).primaryKey().notNull(),
	created: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("authtoken_token_key_10f0b77e_like").using("btree", table.key.asc().nullsLast().op("varchar_pattern_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "authtoken_token_user_id_35299eff_fk_users_user_cid"
		}),
	unique("authtoken_token_user_id_key").on(table.userId),
]);

export const connectionsControllersession = pgTable("connections_controllersession", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "connections_controllersession_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	callsign: varchar({ length: 16 }).notNull(),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	duration: interval().notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("connections_controllersession_user_id_9c942d8f").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "connections_controll_user_id_9c942d8f_fk_users_use"
		}),
]);

export const connectionsOnlinecontroller = pgTable("connections_onlinecontroller", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "connections_onlinecontroller_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	callsign: varchar({ length: 16 }).notNull(),
	onlineSince: timestamp("online_since", { withTimezone: true, mode: 'string' }).notNull(),
	lastUpdated: timestamp("last_updated", { withTimezone: true, mode: 'string' }).notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("connections_onlinecontroller_user_id_9b5048e3").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "connections_onlinecontroller_user_id_9b5048e3_fk_users_user_cid"
		}),
]);

export const djangoAdminLog = pgTable("django_admin_log", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "django_admin_log_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	actionTime: timestamp("action_time", { withTimezone: true, mode: 'string' }).notNull(),
	objectId: text("object_id"),
	objectRepr: varchar("object_repr", { length: 200 }).notNull(),
	actionFlag: smallint("action_flag").notNull(),
	changeMessage: text("change_message").notNull(),
	contentTypeId: integer("content_type_id"),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("django_admin_log_content_type_id_c4bce8eb").using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
	index("django_admin_log_user_id_c564eba6").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.contentTypeId],
			foreignColumns: [djangoContentType.id],
			name: "django_admin_log_content_type_id_c4bce8eb_fk_django_co"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "django_admin_log_user_id_c564eba6_fk_users_user_cid"
		}),
	check("django_admin_log_action_flag_check", sql`action_flag >= 0`),
]);

export const eventsEventposition = pgTable("events_eventposition", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_eventposition_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	callsign: varchar({ length: 16 }).notNull(),
	eventId: integer("event_id").notNull(),
}, (table) => [
	index("events_eventposition_event_id_1757e488").using("btree", table.eventId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [eventsEvent.id],
			name: "events_eventposition_event_id_1757e488_fk_events_event_id"
		}),
]);

export const eventsPositionpreset = pgTable("events_positionpreset", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_positionpreset_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 64 }).notNull(),
	positions: jsonb().notNull(),
});

export const eventsEventscore = pgTable("events_eventscore", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_eventscore_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	score: integer().notNull(),
	notes: jsonb().notNull(),
	eventId: integer("event_id").notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("events_eventscore_event_id_c0a06504").using("btree", table.eventId.asc().nullsLast().op("int4_ops")),
	index("events_eventscore_user_id_c6300361").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [eventsEvent.id],
			name: "events_eventscore_event_id_c0a06504_fk_events_event_id"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "events_eventscore_user_id_c6300361_fk_users_user_cid"
		}),
	check("events_eventscore_score_check", sql`score >= 0`),
]);

export const eventsPositionshift = pgTable("events_positionshift", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_positionshift_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	positionId: integer("position_id").notNull(),
	userId: integer("user_id"),
}, (table) => [
	index("events_positionshift_position_id_b5488cc5").using("btree", table.positionId.asc().nullsLast().op("int4_ops")),
	index("events_positionshift_user_id_35564b21").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.positionId],
			foreignColumns: [eventsEventposition.id],
			name: "events_positionshift_position_id_b5488cc5_fk_events_ev"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "events_positionshift_user_id_35564b21_fk_users_user_cid"
		}),
]);

export const eventsSupportrequest = pgTable("events_supportrequest", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_supportrequest_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 128 }).notNull(),
	banner: varchar({ length: 200 }),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	host: varchar({ length: 32 }).notNull(),
	requestedFields: jsonb("requested_fields").notNull(),
	description: text(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("events_supportrequest_user_id_351222e3").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "events_supportrequest_user_id_351222e3_fk_users_user_cid"
		}),
]);

export const mailerEmail = pgTable("mailer_email", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "mailer_email_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	subject: varchar({ length: 255 }).notNull(),
	htmlBody: text("html_body").notNull(),
	textBody: text("text_body").notNull(),
	fromEmail: varchar("from_email", { length: 254 }).notNull(),
	toEmail: text("to_email").notNull(),
	ccEmail: varchar("cc_email", { length: 255 }),
	bccEmail: varchar("bcc_email", { length: 255 }),
	status: integer().notNull(),
	lastAttempt: timestamp("last_attempt", { withTimezone: true, mode: 'string' }),
	error: text(),
});

export const resourcesResource = pgTable("resources_resource", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "resources_resource_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 128 }).notNull(),
	category: varchar({ length: 16 }).notNull(),
	path: varchar({ length: 100 }).notNull(),
	updated: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const tmuAtis = pgTable("tmu_atis", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "tmu_atis_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	facility: varchar({ length: 4 }).notNull(),
	configProfile: varchar("config_profile", { length: 16 }).notNull(),
	atisLetter: varchar("atis_letter", { length: 1 }).notNull(),
	airportConditions: text("airport_conditions").notNull(),
	notams: text().notNull(),
	updated: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const feedbackFeedback = pgTable("feedback_feedback", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "feedback_feedback_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	controllerCallsign: varchar("controller_callsign", { length: 16 }),
	pilotCallsign: varchar("pilot_callsign", { length: 16 }),
	rating: integer().notNull(),
	comments: text().notNull(),
	created: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	approved: boolean().notNull(),
	controllerId: integer("controller_id"),
	eventId: integer("event_id"),
	pilotId: integer("pilot_id"),
}, (table) => [
	index("feedback_feedback_controller_id_12f921a6").using("btree", table.controllerId.asc().nullsLast().op("int4_ops")),
	index("feedback_feedback_event_id_413ecb7a").using("btree", table.eventId.asc().nullsLast().op("int4_ops")),
	index("feedback_feedback_pilot_id_90727601").using("btree", table.pilotId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.controllerId],
			foreignColumns: [usersUser.cid],
			name: "feedback_feedback_controller_id_12f921a6_fk_users_user_cid"
		}),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [eventsEvent.id],
			name: "feedback_feedback_event_id_413ecb7a_fk_events_event_id"
		}),
	foreignKey({
			columns: [table.pilotId],
			foreignColumns: [usersUser.cid],
			name: "feedback_feedback_pilot_id_90727601_fk_users_user_cid"
		}),
]);

export const loaLoa = pgTable("loa_loa", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "loa_loa_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	start: date().notNull(),
	end: date().notNull(),
	remarks: text().notNull(),
	approved: boolean().notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("loa_loa_user_id_d50ca043").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "loa_loa_user_id_d50ca043_fk_users_user_cid"
		}),
]);

export const tmuMetar = pgTable("tmu_metar", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "tmu_metar_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	station: varchar({ length: 4 }).notNull(),
	raw: text().notNull(),
	flightRules: varchar("flight_rules", { length: 4 }).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
});

export const tmuTmunotice = pgTable("tmu_tmunotice", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "tmu_tmunotice_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	info: text().notNull(),
	timeIssued: timestamp("time_issued", { withTimezone: true, mode: 'string' }).notNull(),
	timeExpires: timestamp("time_expires", { withTimezone: true, mode: 'string' }).notNull(),
});

export const trainingTrainingsession = pgTable("training_trainingsession", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "training_trainingsession_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	movements: integer().notNull(),
	progress: integer().notNull(),
	position: varchar({ length: 16 }),
	type: integer().notNull(),
	level: integer().notNull(),
	status: integer().notNull(),
	otsStatus: integer("ots_status").notNull(),
	ctrsId: integer("ctrs_id"),
	notes: text(),
	soloGranted: boolean("solo_granted").notNull(),
	instructorId: integer("instructor_id"),
	studentId: integer("student_id"),
}, (table) => [
	index("training_trainingsession_instructor_id_e1709fa8").using("btree", table.instructorId.asc().nullsLast().op("int4_ops")),
	index("training_trainingsession_student_id_13f1f665").using("btree", table.studentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.instructorId],
			foreignColumns: [usersUser.cid],
			name: "training_trainingses_instructor_id_e1709fa8_fk_users_use"
		}),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [usersUser.cid],
			name: "training_trainingsession_student_id_13f1f665_fk_users_user_cid"
		}),
]);

export const usersUserGroups = pgTable("users_user_groups", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "users_user_groups_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: integer("user_id").notNull(),
	groupId: integer("group_id").notNull(),
}, (table) => [
	index("users_user_groups_group_id_9afc8d0e").using("btree", table.groupId.asc().nullsLast().op("int4_ops")),
	index("users_user_groups_user_id_5f6f5a90").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [authGroup.id],
			name: "users_user_groups_group_id_9afc8d0e_fk_auth_group_id"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "users_user_groups_user_id_5f6f5a90_fk_users_user_cid"
		}),
	unique("users_user_groups_user_id_group_id_b88eab82_uniq").on(table.userId, table.groupId),
]);

export const trainingMentoravailability = pgTable("training_mentoravailability", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "training_mentoravailability_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	day: integer().notNull(),
	start: time().notNull(),
	end: time().notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("training_mentoravailability_user_id_ab3a6577").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "training_mentoravailability_user_id_ab3a6577_fk_users_user_cid"
		}),
	unique("training_mentoravailability_user_id_day_feeb0b90_uniq").on(table.day, table.userId),
]);

export const trainingTrainingrequest = pgTable("training_trainingrequest", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "training_trainingrequest_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	start: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	end: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	type: integer().notNull(),
	level: integer().notNull(),
	remarks: text(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("training_trainingrequest_user_id_a541f51e").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "training_trainingrequest_user_id_a541f51e_fk_users_user_cid"
		}),
]);

export const usersRole = pgTable("users_role", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "users_role_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	long: varchar({ length: 32 }).notNull(),
	short: varchar({ length: 8 }).notNull(),
});

export const usersUserUserPermissions = pgTable("users_user_user_permissions", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "users_user_user_permissions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: integer("user_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	index("users_user_user_permissions_permission_id_0b93982e").using("btree", table.permissionId.asc().nullsLast().op("int4_ops")),
	index("users_user_user_permissions_user_id_20aca447").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [authPermission.id],
			name: "users_user_user_perm_permission_id_0b93982e_fk_auth_perm"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "users_user_user_permissions_user_id_20aca447_fk_users_user_cid"
		}),
	unique("users_user_user_permissions_user_id_permission_id_43338c45_uniq").on(table.userId, table.permissionId),
]);

export const visitVisitingapplication = pgTable("visit_visitingapplication", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "visit_visitingapplication_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	reason: text().notNull(),
	submitted: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "visit_visitingapplication_user_id_cbd2f710_fk_users_user_cid"
		}),
	unique("visit_visitingapplication_user_id_key").on(table.userId),
]);

export const usersUser = pgTable("users_user", {
	password: varchar({ length: 128 }).notNull(),
	lastLogin: timestamp("last_login", { withTimezone: true, mode: 'string' }),
	isSuperuser: boolean("is_superuser").notNull(),
	cid: integer().primaryKey().notNull(),
	email: varchar({ length: 254 }).notNull(),
	firstName: varchar("first_name", { length: 32 }).notNull(),
	lastName: varchar("last_name", { length: 32 }).notNull(),
	profile: varchar({ length: 100 }),
	biography: text(),
	rating: varchar({ length: 3 }).notNull(),
	homeFacility: varchar("home_facility", { length: 16 }).notNull(),
	status: integer().notNull(),
	initials: varchar({ length: 2 }),
	joined: timestamp({ withTimezone: true, mode: 'string' }),
	endorsements: jsonb(),
	preventEventSignup: boolean("prevent_event_signup").notNull(),
	cicEndorsed: boolean("cic_endorsed").notNull(),
});

export const eventsShiftrequest = pgTable("events_shiftrequest", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "events_shiftrequest_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	shiftId: integer("shift_id").notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	index("events_shiftrequest_shift_id_c1fe6425").using("btree", table.shiftId.asc().nullsLast().op("int4_ops")),
	index("events_shiftrequest_user_id_72d985b1").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.shiftId],
			foreignColumns: [eventsPositionshift.id],
			name: "events_shiftrequest_shift_id_c1fe6425_fk_events_po"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "events_shiftrequest_user_id_72d985b1_fk_users_user_cid"
		}),
]);

export const usersUserRoles = pgTable("users_user_roles", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "users_user_roles_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	userId: integer("user_id").notNull(),
	roleId: integer("role_id").notNull(),
}, (table) => [
	index("users_user_roles_role_id_910b8739").using("btree", table.roleId.asc().nullsLast().op("int4_ops")),
	index("users_user_roles_user_id_f0af70c6").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [usersRole.id],
			name: "users_user_roles_role_id_910b8739_fk_users_role_id"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersUser.cid],
			name: "users_user_roles_user_id_f0af70c6_fk_users_user_cid"
		}),
	unique("users_user_roles_user_id_role_id_e9062687_uniq").on(table.userId, table.roleId),
]);
