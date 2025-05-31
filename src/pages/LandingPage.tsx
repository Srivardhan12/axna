import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div>
            <Link to="/login">
                <Button variant="outline" className="cursor-pointer">Login</Button>
            </Link>
            <Link to="/signup">
                <Button variant="outline" className="cursor-pointer">Sign up</Button>
            </Link>
        </div >
    )
}
