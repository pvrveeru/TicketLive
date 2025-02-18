import moment from 'moment';

export const formatDate = (dateString: string) => {
    return moment.utc(dateString).format('MMMM DD, YYYY hh:mm A');
};
