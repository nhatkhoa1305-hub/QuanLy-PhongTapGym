import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'

const documentationLinks = [
  { href: 'https://vite.dev/', label: 'Explore Vite', image: viteLogo, imageClassName: 'logo' },
  {
    href: 'https://react.dev/',
    label: 'Learn more',
    image: reactLogo,
    imageClassName: 'button-icon',
  },
]

const communityLinks = [
  { href: 'https://github.com/vitejs/vite', label: 'GitHub', icon: 'github-icon' },
  { href: 'https://chat.vite.dev/', label: 'Discord', icon: 'discord-icon' },
  { href: 'https://x.com/vite_js', label: 'X.com', icon: 'x-icon' },
  { href: 'https://bsky.app/profile/vite.dev', label: 'Bluesky', icon: 'bluesky-icon' },
]

function LinkGroup({ id, icon, title, description, links }) {
  return (
    <div id={id}>
      <svg className="icon" role="presentation" aria-hidden="true">
        <use href={`/icons.svg#${icon}`}></use>
      </svg>
      <h2>{title}</h2>
      <p>{description}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.image ? (
                <img
                  className={link.imageClassName}
                  src={link.image}
                  alt=""
                />
              ) : (
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href={`/icons.svg#${link.icon}`}></use>
                </svg>
              )}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NextSteps() {
  return (
    <section id="next-steps">
      <LinkGroup
        id="docs"
        icon="documentation-icon"
        title="Documentation"
        description="Your questions, answered"
        links={documentationLinks}
      />
      <LinkGroup
        id="social"
        icon="social-icon"
        title="Connect with us"
        description="Join the Vite community"
        links={communityLinks}
      />
    </section>
  )
}

export default NextSteps