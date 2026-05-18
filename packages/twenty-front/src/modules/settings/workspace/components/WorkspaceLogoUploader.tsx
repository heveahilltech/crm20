import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { ImageInput } from '@/ui/input/components/ImageInput';
import { useMutation } from '@apollo/client/react';
import {
  UpdateWorkspaceDocument,
  UploadWorkspaceLogoDocument,
} from '~/generated-metadata/graphql';
import { isDefined } from 'twenty-shared/utils';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

export const WorkspaceLogoUploader = () => {
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
  };

  return (
    <ImageInput
      picture={currentWorkspace?.logo}
      onUpload={onUpload}
      onRemove={onRemove}
    />
  );
};
