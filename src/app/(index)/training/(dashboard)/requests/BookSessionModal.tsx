'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import Slider from 'rc-slider';
import { format } from 'date-fns-tz';
import { LuArrowRight } from 'react-icons/lu';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { SelectInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { fetchApi } from '@/utils/fetch';
import { type TrainingRequest } from '@/types/training';
import { sessionLevels, sessionTypes } from '../../selectOptions';
import { type BookSessionFormValues, bookSessionSchema } from './bookSessionSchema';
import 'rc-slider/assets/index.css';

interface BookSessionModalProps extends ModalProps {
    request: TrainingRequest;
}

const FIFTEEN_MIN_MS = 1000 * 60 * 15;

export const BookSessionModal: React.FC<BookSessionModalProps> = ({ request, show, close }) => {
    const router = useRouter();

    const [start, end, marks] = useMemo(() => {
        const startUnix = new Date(request.start).getTime();
        const endUnix = new Date(request.end).getTime();

        const roundedStartUnix = Math.ceil(startUnix / FIFTEEN_MIN_MS) * FIFTEEN_MIN_MS;
        const roundedEndUnix = Math.floor(endUnix / FIFTEEN_MIN_MS) * FIFTEEN_MIN_MS;

        return [
            new Date(roundedStartUnix),
            new Date(roundedEndUnix),
            Object.fromEntries(
                new Array(Math.floor((roundedEndUnix - roundedStartUnix) / FIFTEEN_MIN_MS))
                    .fill(undefined)
                    .map((_, i) => [roundedStartUnix + FIFTEEN_MIN_MS * i, ' ']),
            ),
        ];
    }, [request]);

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<BookSessionFormValues>({
        resolver: zodResolver(bookSessionSchema),
        defaultValues: {
            start,
            end,
            type: sessionTypes.find(({ value }) => value === request.type),
            level: sessionLevels.find(({ value }) => value === request.level),
        },
    });

    const putRequest: SubmitHandler<BookSessionFormValues> = useCallback((values) => {
        const data = {
            ...values,
            type: values.type.value,
            level: values.level.value,
        };
        toast.promise(
            fetchApi(`/training/request/${request.id}/`, { method: 'PUT', body: JSON.stringify(data) }),
            {
                pending: 'Booking session',
                success: 'Successfully booked',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [request, router, close]);

    const [currentStart, currentEnd] = useWatch({ control, name: ['start', 'end'] });

    return (
        <Modal large show={show} title="Book Session" close={close}>
            <form onSubmit={handleSubmit(putRequest)}>
                <p className="mb-5">
                    Drag the slider to set the start and end times for the training session.
                    The limits are automatically set to what the student indicated as their availability.
                </p>

                <div className="mb-3 flex items-center justify-center gap-2">
                    <Badge className="w-52">
                        {format(currentStart, 'MMM d, y @ HH:mm zzz')}
                    </Badge>
                    <LuArrowRight size={20} className="text-sky-400" />
                    <Badge className="w-52">
                        {format(currentEnd, 'MMM d, y @ HH:mm zzz')}
                    </Badge>
                </div>

                <Controller
                    name="start"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                        <Slider
                            {...field}
                            className="mb-5"
                            range
                            marks={marks}
                            step={null}
                            allowCross={false}
                            min={start.getTime()}
                            max={end.getTime()}
                            defaultValue={[start.getTime(), end.getTime()]}
                            onChange={(val) => {
                                // rc-slider has bad typings, but since we have `range` set, this will always be an array
                                const newRange = val as number[];
                                setValue('start', new Date(newRange[0]));
                                setValue('end', new Date(newRange[1]));
                            }}
                        />
                    )}
                />
                <div className="mb-3 grid grid-cols-2 gap-3">
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
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
                                label="Level"
                                error={errors.level?.message}
                                options={sessionLevels}
                            />
                        )}
                    />
                </div>

                <TextInput
                    {...register('position')}
                    className="mb-5"
                    label="Postition (Optional)"
                    error={errors.position?.message}
                />

                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit">Book</Button>
                </div>
            </form>
        </Modal>
    );
};

interface BookSessionButtonProps {
    request: TrainingRequest;
}

export const BookSessionButton: React.FC<BookSessionButtonProps> = ({ request }) => (
    <ModalButton
        modal={<BookSessionModal request={request} />}
        variant="secondary"
        className="text-sm"
    >
        Book
    </ModalButton>
);
