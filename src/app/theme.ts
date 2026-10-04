import { Badge, createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  components: { Badge: Badge.extend({ defaultProps: { tt: 'none' } }) },
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif",
  headings: { fontFamily: 'inherit', fontWeight: '700' },
  fontSizes: { xs: '0.8125rem', sm: '0.9375rem', md: '1rem' },
  defaultGradient: { from: 'blue', to: 'cyan', deg: 120 },
})
