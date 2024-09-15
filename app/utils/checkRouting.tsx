export const checkRouting = () => {
    const token = localStorage.getItem('token')

    return !!token;
}