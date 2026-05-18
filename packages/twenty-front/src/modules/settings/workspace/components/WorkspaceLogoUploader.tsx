import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { ImageInput } from '@/ui/input/components/ImageInput';
import { useLoadCurrentUser } from '@/users/hooks/useLoadCurrentUser';
import { useMutation } from '@apollo/client/react';
import { isDefined } from 'twenty-shared/utils';
import {
  UpdateWorkspaceDocument,
  UploadWorkspaceLogoDocument,
} from '~/generated-metadata/graphql';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

export const WorkspaceLogoUploader = () => {
  const { loadCurrentUser } = useLoadCurrentUser();
  const [uploadLogo] = useMutation(UploadWorkspaceLogoDocument);
  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);
  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );

  const onUpload = async (file: File) => {
    if (isUndefinedOrNull(file)) {
      return;
    }
    if (!currentWorkspace?.id) {
      throw new Error('Workspace id not found');
    }

    const { data } = await uploadLogo({
      variables: {
        file,
      },
    });

    const logoUrl = data?.uploadWorkspaceLogo?.url;

    if (!isDefined(logoUrl)) {
      return;
    }

    setCurrentWorkspace((previousWorkspace) =>
      previousWorkspace
        ? {
            ...previousWorkspace,
            logo: logoUrl,
          }
        : previousWorkspace,
    );

    await loadCurrentUser();
  };

  const onRemove = async () => {
    if (!currentWorkspace?.id) {
      throw new Error('Workspace id not found');
    }

    await updateWorkspace({
      variables: {
        input: {
          logo: null,
        },
      },
    });

    setCurrentWorkspace((previousWorkspace) =>
      previousWorkspace
        ? {
            ...previousWorkspace,
            logo: null,
          }
        : previousWorkspace,
    );

    await loadCurrentUser();
  };

  return (
    <ImageInput
      picture={currentWorkspace?.logo}
      onUpload={onUpload}
      onRemove={onRemove}
    />
  );
};
