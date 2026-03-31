import { useGetUserQuery } from 'hooks/api/user/userHooks';
import { useParams } from 'react-router';
import UserForm from './user-form';

export default function SingleUserPage() {
  const { id } = useParams();
  const { data: user, isLoading } = useGetUserQuery({ id });

  return (
    <>
      <UserForm user={user} isLoading={isLoading} id={id} />
    </>
  );
}
