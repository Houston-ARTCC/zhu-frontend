'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { SelectInput, type SelectOption, TextInput, ToggleInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { otsStatuses, progress, sessionLevels, sessionTypes } from '../../selectOptions';
import { type SessionFormValues, sessionSchema } from './sessionSchema';

interface FileSessionFormProps {
    editing?: boolean;
    session: TrainingSession;
    instructorOptions: {
        label: string;
        options: SelectOption[];
    }[];
}

export const SessionForm: React.FC<FileSessionFormProps> = ({ editing = false, session, instructorOptions }) => {
    const router = useRouter();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SessionFormValues>({
        resolver: zodResolver(sessionSchema),
        defaultValues: {
            instructor: {
                value: session.instructor.cid,
                label: `${session.instructor.first_name} ${session.instructor.last_name}`,
            },
            start: new Date(session.start),
            end: new Date(session.end),
            type: sessionTypes.find(({ value }) => value === session.type),
            level: sessionLevels.find(({ value }) => value === session.level),
            ots_status: otsStatuses.find(({ value }) => value === session.ots_status),
            progress: progress.find(({ value }) => value === session.progress),
            movements: session.movements ?? 0,
            position: session.position ?? undefined,
            solo_granted: session.solo_granted,
            notes: session.notes ?? undefined,
        },
    });

    const saveSession: SubmitHandler<SessionFormValues> = useCallback((values) => {
        const data = {
            ...values,
            instructor: values.instructor.value,
            type: values.type.value,
            level: values.level.value,
            ots_status: values.ots_status.value,
            progress: values.progress.value,
        };
        toast.promise(
            fetchApi(
                `/training/session/${session.id}/`,
                { method: editing ? 'PUT' : 'POST', body: JSON.stringify(data) },
            ),
            {
                pending: 'Saving session',
                success: 'Successfully saved',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.back();
                router.refresh();
            });
    }, [editing, session, router]);

    return (
        <form onSubmit={handleSubmit(saveSession)}>
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    <TextInput
                        className="xl:col-span-3"
                        disabled
                        label="Student"
                        value={`${session.student.first_name} ${session.student.last_name}`}
                    />
                    <Controller
                        name="instructor"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                className="xl:col-span-3"
                                label="Instructor"
                                options={instructorOptions}
                            />
                        )}
                    />
                    <Controller
                        name="start"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col xl:col-span-3">
                                <ReactDatePicker
                                    {...field}
                                    showTimeSelect
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={(
                                        <TextInput
                                            label="Start (Zulu)"
                                            error={errors.start?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="end"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col xl:col-span-3">
                                <ReactDatePicker
                                    {...field}
                                    showTimeSelect
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={(
                                        <TextInput
                                            label="End (Zulu)"
                                            error={errors.end?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                className="xl:col-span-2"
                                label="Type"
                                error={errors.type?.message}
                                options={sessionTypes}
                            />
                        )}
                    />
                    <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                className="xl:col-span-2"
                                label="Level"
                                error={errors.level?.message}
                                options={sessionLevels}
                            />
                        )}
                    />
                    <Controller
                        name="ots_status"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                className="xl:col-span-2"
                                label="OTS Status"
                                error={errors.ots_status?.message}
                                options={otsStatuses}
                            />
                        )}
                    />
                    <Controller
                        name="progress"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                className="xl:col-span-2"
                                label="Progress"
                                error={errors.progress?.message}
                                options={progress}
                            />
                        )}
                    />
                    <TextInput
                        {...register('movements', { valueAsNumber: true })}
                        className="xl:col-span-2"
                        label="Movements"
                        type="number"
                        error={errors.movements?.message}
                    />
                    <TextInput
                        {...register('position')}
                        className="xl:col-span-2"
                        label="Position"
                        error={errors.position?.message}
                    />
                </div>

                <div className="flex flex-col">
                    <p className="mb-2 max-w-fit font-medium">
                        Notes
                    </p>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <>
                                <ReactQuill
                                    {...field}
                                    className={classNames({ error: errors.notes })}
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                                            ['link', 'image', 'code-block'],
                                            ['clean'],
                                        ],
                                    }}
                                />
                                {errors.notes && <span className="mt-1 text-sm text-red-400">{errors.notes.message}</span>}
                            </>
                        )}
                    />
                </div>
            </div>

            <ToggleInput
                {...register('solo_granted')}
                className="mb-5"
                label="Solo endorsement was granted at the conclusion of this session"
            />

            <div className="flex gap-3">
                <Button color="gray-300" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </div>
        </form>
    );
};
