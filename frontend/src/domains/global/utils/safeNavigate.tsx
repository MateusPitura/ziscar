/**
 * Using href instead of navigate from react-router to clear memory and cache
 * @param path the path destination
 */
export default function safeNavigate(path: string): void {
    window.location.href = path;
}