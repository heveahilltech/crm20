import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import { VoxRing_FavIcon } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo';
import { Helmet } from 'react-helmet-async';
import { useRecoilValue } from 'recoil';
import { getImageAbsoluteURI } from 'twenty-shared/utils';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

export const PageFavicon = () => {
  const workspacePublicData = useRecoilValue(workspacePublicDataState);
  return (
    <Helmet>
      <link
        rel="icon"
        type="image/x-icon"
        href={
          workspacePublicData?.logo
            ? (getImageAbsoluteURI({
                imageUrl: workspacePublicData.logo,
                baseUrl: REACT_APP_SERVER_BASE_URL,
              }) ?? VoxRing_FavIcon)
            : VoxRing_FavIcon
        }
      />
    </Helmet>
  );
};
