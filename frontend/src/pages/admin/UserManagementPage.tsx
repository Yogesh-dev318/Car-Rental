import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';

const UserManagementPage = () => {
    const { users, fetchAllUsers, deleteUser, isLoading } = useUserStore();
    const { user: currentUser } = useAuthStore();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };
    
    const confirmDelete = async () => {
        if (userToDelete) {
            const success = await deleteUser(userToDelete.id);
            if (success) {
                setIsConfirmOpen(false);
                setUserToDelete(null);
            }
        }
    }

    if (isLoading && users.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <Button asChild>
                    <Link to="/admin/signup">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Admin
                    </Link>
                </Button>
            </div>
             
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete the user "{userToDelete?.firstName} {userToDelete?.lastName}" and all associated data. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                         <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                         <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        onClick={() => handleDeleteClick(user)}
                                        disabled={user.role === 'admin' || user.id === currentUser?.id}
                                        title={user.role === 'admin' ? "Cannot delete an admin" : ""}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserManagementPage;