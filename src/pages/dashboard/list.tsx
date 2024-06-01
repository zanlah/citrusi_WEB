import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLayout from '@/components/DefaultLayout';

const List = () => {

    const { page } = useParams();
    const navigate = useNavigate();
    const [routes, setRoutes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const currentPageTemp = parseInt(page ?? '', 10) || 1;
        setCurrentPage(currentPageTemp);
        fetch(`http://52.143.190.38/api/routes/list-paginated?page=${currentPageTemp}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setRoutes(data.routes);
                setTotalPages(5); //to spremeni
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

    }, [page]);
    // Convert page to a number and handle pagination logic


    // Function to navigate to the previous or next page
    const handlePageChange = (newPage: any) => {
        navigate(`/list/${newPage}`);
    };

    const formatTime = (minutes: number) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDistance = (distance: number) => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)} km`;
        }
        return `${distance} m`;
    };

    return (
        <DefaultLayout>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ime</TableHead>
                        <TableHead>Višinjska razlika</TableHead>
                        <TableHead>Razdalja</TableHead>
                        <TableHead>Čas</TableHead>
                        <TableHead className="text-right">Tip poti</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {routes.map((route, index) => (
                        <TableRow key={index}>
                            <TableCell>{route.name}</TableCell>
                            <TableCell>{route.cumulativeElevationGain} m </TableCell>
                            <TableCell>{formatDistance(route.distance)}</TableCell>
                            <TableCell>{formatTime(route.duration)} </TableCell>
                            <TableCell className="text-right">{route.trailType}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination className='mt-5'>
                <PaginationContent>
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                        </PaginationItem>
                    )}
                    {[...Array(totalPages).keys()].map(pageNum => (
                        <PaginationItem key={pageNum} className={pageNum + 1 == currentPage ? 'text-indigo-500' : ''}>
                            <PaginationLink onClick={() => handlePageChange(pageNum + 1)}>
                                {pageNum + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </DefaultLayout>

    )
}

export default List