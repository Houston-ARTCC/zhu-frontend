import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { getQuarter, getYear } from 'date-fns';

export function useStatistics<T extends Record<string, unknown>>(apiPath: (key: string) => string, initialData: T): {
    loading: boolean,
    data: T | undefined,
    currentDate: Date,
    setCurrentDate: Dispatch<SetStateAction<Date>>,
} {
    const [loading, setLoading] = useState<boolean>(false);

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [data, setData] = useState<T>(initialData);

    const dateKey = useMemo(() => `${getYear(currentDate)}/${getQuarter(currentDate) - 1}`, [currentDate]);

    const dates = useRef(new Map([[dateKey, initialData]]));

    useEffect(() => {
        if (dates.current.has(dateKey)) {
            setData(dates.current.get(dateKey)!);
            return;
        }

        setLoading(true);

        fetch(apiPath(dateKey))
            .then((resp) => resp.json() as Promise<T>)
            .then((newData) => {
                dates.current.set(dateKey, newData);
                setData(newData);
                setLoading(false);
            });
    }, [apiPath, dateKey]);

    return { loading, data, currentDate, setCurrentDate };
}
