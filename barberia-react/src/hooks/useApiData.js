import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/api';

/** Carga datos desde la API con estados de carga y error, y permite recargar. */
const useApiData = (fetcher, inicial = []) => {
    const [data, setData] = useState(inicial);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            setData(await fetcher());
            setError('');
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    return { data, setData, loading, error, setError, reload };
};

export default useApiData;
