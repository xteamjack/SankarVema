# Customer logos

Drop the official customer logo files here. The animated logo carousel
(`app/components/LogoMarquee.vue`) loads them by the exact filenames below —
add a file and it appears automatically; until then a clean text wordmark is
shown as a fallback, so nothing ever looks broken.

**Format:** SVG preferred (crisp at any size). A transparent-background,
single-colour / monochrome mark works best — the carousel applies a grayscale
+ brightness treatment so mixed-colour logos still sit together cleanly, and it
auto-inverts them in dark mode. PNG with a transparent background is also fine
(use a tall enough resolution, ~80px+ height).

**Expected filenames** (referenced from `app/content/assignments.yml`):

| Customer            | File                      |
| ------------------- | ------------------------- |
| Government of India | `govt-india.svg`          |
| Nestlé              | `nestle.svg`              |
| Philips             | `philips.svg`             |
| AT&T                | `att.svg`                 |
| Zurich Insurance    | `zurich.svg`              |
| Mastercard          | `mastercard.svg`          |
| John Deere          | `john-deere.svg`          |
| Caterpillar         | `caterpillar.svg`         |
| Airbus              | `airbus.svg`              |
| Hyundai             | `hyundai.svg`             |
| KONE                | `kone.svg`                |
| Tata JLR            | `tata-jlr.svg`            |

To change a path or add a new customer, edit the `customers:` list in
`app/content/assignments.yml` (each entry has `name`, `sector` and `logo`).

> Note: these are third-party trademarks. Use them only to represent genuine
> engagements, and follow each brand's logo-usage guidelines.
