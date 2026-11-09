import { expect, test } from 'vitest';
import { SessionStatus } from '@/types/training';
import {
    getAllScheduledSessions,
    getOwnTrainingRequests,
    getPendingRequests,
    getSessionsByInstructor,
    getSessionsByStudent,
    getTrainingNotifications,
    getTrainingRequestHistory,
} from './repository';

test('getTrainingNotifications returns three numeric fields', async () => {
    // Use a CID that is unlikely to exist; we just want the shape back.
    const result = await getTrainingNotifications(0);
    expect(typeof result.scheduled_sessions).toBe('number');
    expect(typeof result.training_requests).toBe('number');
    expect(typeof result.instructor_sessions).toBe('number');
});

test('getSessionsByStudent returns desc-ordered sessions with expected shape', async () => {
    const sessions = await getSessionsByStudent(0);
    expect(Array.isArray(sessions)).toBe(true);

    if (sessions.length < 2) return;

    const starts = sessions.map((s) => new Date(s.start).getTime());
    const sorted = [...starts].sort((a, b) => b - a);
    expect(starts).toEqual(sorted);

    const first = sessions[0];
    expect(typeof first.id).toBe('number');
    expect(typeof first.start).toBe('string');
    expect(typeof first.end).toBe('string');
    expect(typeof first.movements).toBe('number');
    expect(typeof first.progress).toBe('number');
    expect(typeof first.solo_granted).toBe('boolean');
    expect(typeof first.student.cid).toBe('number');
    expect(typeof first.instructor.cid).toBe('number');
});

test('getSessionsByInstructor returns desc-ordered sessions with expected shape', async () => {
    const sessions = await getSessionsByInstructor(0);
    expect(Array.isArray(sessions)).toBe(true);

    if (sessions.length < 2) return;

    const starts = sessions.map((s) => new Date(s.start).getTime());
    const sorted = [...starts].sort((a, b) => b - a);
    expect(starts).toEqual(sorted);

    const first = sessions[0];
    expect(typeof first.instructor.cid).toBe('number');
    expect(typeof first.student.cid).toBe('number');
});

test('getAllScheduledSessions returns only status=0 rows', async () => {
    const sessions = await getAllScheduledSessions();
    expect(Array.isArray(sessions)).toBe(true);
    for (const session of sessions) {
        expect(session.status).toBe(SessionStatus.Scheduled);
    }
});

test('getPendingRequests returns groups with last_session set or null', async () => {
    const groups = await getPendingRequests();
    expect(Array.isArray(groups)).toBe(true);
    for (const group of groups) {
        expect(typeof group.user.cid).toBe('number');
        expect(Array.isArray(group.requests)).toBe(true);
        expect(group.requests.length).toBeGreaterThan(0);
        expect(group.last_session === null || typeof group.last_session === 'string').toBe(true);
    }
});

test('getOwnTrainingRequests returns asc-ordered requests with expected shape', async () => {
    const requests = await getOwnTrainingRequests(0);
    expect(Array.isArray(requests)).toBe(true);

    if (requests.length < 2) return;

    const starts = requests.map((r) => new Date(r.start).getTime());
    const sorted = [...starts].sort((a, b) => a - b);
    expect(starts).toEqual(sorted);
});

test('getTrainingRequestHistory returns entries with user, count, last_request', async () => {
    const history = await getTrainingRequestHistory();
    expect(Array.isArray(history)).toBe(true);
    for (const entry of history) {
        expect(typeof entry.user.cid).toBe('number');
        expect(typeof entry.count).toBe('number');
        expect(entry.count).toBeGreaterThan(0);
        expect(typeof entry.last_request).toBe('string');
    }
});
