import { type I18n } from '@lingui/core';
import { Column, Container, Row } from '@react-email/components';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://voxring.ai/"
              value={i18n._('Website')}
              aria-label={i18n._("Visit VoxRing's website")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://voxring.ai/privacy-policy/"
              value={i18n._('Privacy Policy')}
              aria-label={i18n._("Visit VoxRing's privacy policy")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://voxring.ai/termsofservice/"
              value={i18n._('Terms of Service')}
              aria-label={i18n._("Read VoxRing's terms of service")}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          {i18n._('VoxRing.ai')}
        </>
      </ShadowText>
    </Container>
  );
};
