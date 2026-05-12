import { useState, useCallback } from 'react';

export function usePaginate(arr, perPage) {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(arr.length / perPage);
    const onPage = arr.slice((page - 1) * perPage, page * perPage);

    const goToSpecific = useCallback((idx, currentPerPage = perPage) => {
        const target = Math.ceil((idx + 1) / currentPerPage);
        console.log('goToSpecific executing:', { idx, currentPerPage, perPage, target });
        setPage(target);
    }, [perPage]);

    return {
        totalPages,
        onPage,
        currPage: page,
        goPrev: () => setPage(p => p - 1),
        goNext: () => setPage(p => p + 1),
        hasPrev: page > 1,
        hasNext: page < totalPages,
        goToSpecific,
    };
}