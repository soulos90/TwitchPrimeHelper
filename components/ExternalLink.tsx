import { Link } from 'expo-router';
import { type ComponentProps, useCallback } from 'react';
import BrowserService from '../src/services/BrowserService';
import * as Haptics from 'expo-haptics';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  const handlePress = useCallback(async (event: any) => {
    event.preventDefault();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await BrowserService.openURL(href);
  }, [href]);

  return (
    <Link
      target="_blank"
      {...rest}
      href={href as any}
      onPress={handlePress}
    />
  );
}
