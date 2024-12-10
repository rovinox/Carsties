'use client'

import React, { useEffect, useState } from 'react'
import AuctionCard from './AuctionCard';
import { Auction, PagedResult } from '@/types';
import AppPagination from '../components/AppPagination';
import { getData } from '../actions/auctionActions';
import Filters from './Filters';
import { useParamsStore } from '@/hooks/useParamsStore';
import { shallow } from 'zustand/shallow';
import qs from 'query-string';
import EmptyFilter from '../components/EmptyFilter';

export default function Listings() {
    const [data, setData] = useState<PagedResult<Auction>>();
    const pageNumber = useParamsStore(state => state.pageNumber)
    const pageSize = useParamsStore(state => state.pageSize)
    const pageCount = useParamsStore(state => state.pageCount)
    const searchTerm = useParamsStore(state => state.searchTerm)
    const searchValue = useParamsStore(state => state.searchValue)
 

    const setParams = useParamsStore(state => state.setParams);
    const url = qs.stringifyUrl({ url: '', query: {
        pageNumber,
        pageSize,
        pageCount,
        searchTerm,
        searchValue,
        orderBy: 'make',
        filterBy: 'live'
    } })

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber })
    }

    useEffect(() => {
        getData(url).then(data => {
            setData(data);
            console.log('data: ', data);
        })
    }, [url])

    if (!data) return <h3>Loading...</h3>

    return (
        <>
            <Filters />
            {data.totalCount === 0 ? (
                <EmptyFilter showReset />
            ) : (
                <>
                    <div className='grid grid-cols-4 gap-6'>
                        {data.results.map(auction => (
                            <AuctionCard auction={auction} key={auction.id} />
                        ))}
                    </div>
                    <div className='flex justify-center mt-4'>
                        <AppPagination pageChanged={setPageNumber}
                            currentPage={pageNumber} pageCount={data.pageCount} />
                    </div>
                </>
            )}

        </>

    )
}
