// ============================================================
// LIVE PREVIEWS FOR THE ADMIN PANEL
// Each bit of text carries data-field="path.to.field" so that
// admin-tweaks.js can highlight it when you click into that field.
// ============================================================

// Small helpers
function f(path, props) {
  var out = props || {};
  out['data-field'] = path;
  return out;
}
function val(map, key) {
  return (map && map.get(key)) || '';
}
// Works for both saved images and photos uploaded but not yet published
function assetUrl(props, path) {
  if (!path) return '';
  try {
    var asset = props.getAsset(path);
    if (asset && typeof asset.then !== 'function' && asset.toString) {
      return asset.toString() || path;
    }
  } catch (e) {}
  return path;
}
// Shown in place of something that's switched off, so you can see it's hidden
function hiddenNote(path, text) {
  return h('div', f(path, { className: 'sp-hidden-note' }), text);
}

// ============================================================
// HOME PAGE
// ============================================================
var HomePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var hero = entry.getIn(['data', 'hero']);
    var nextShow = entry.getIn(['data', 'next_show']);
    var featuresSection = entry.getIn(['data', 'features_section']);
    var features = entry.getIn(['data', 'features']);
    var cta = entry.getIn(['data', 'cta']);

    return h('div', {},

      h('section', f('hero', { className: 'hero' }),
        h('div', { className: 'hero-content container' },
          h('h1', f('hero.heading', { dangerouslySetInnerHTML: { __html: val(hero, 'heading') } })),
          h('p', f('hero.description'), val(hero, 'description')),
          h('div', { style: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' } },
            h('a', f('hero.cta_primary_text', { className: 'btn btn-primary' }), val(hero, 'cta_primary_text')),
            h('a', f('hero.cta_secondary_text', { className: 'btn' }), val(hero, 'cta_secondary_text'))
          )
        )
      ),

      nextShow && nextShow.get('visible')
        ? h('section', f('next_show', { className: 'next-show' }),
            h('div', { className: 'container' },
              h('p', f('next_show.subtitle', { className: 'section-subtitle' }), val(nextShow, 'subtitle')),
              h('h2', f('next_show.title'), val(nextShow, 'title')),
              h('p', f('next_show.details', { className: 'show-details' }), val(nextShow, 'details')),
              h('a', f('next_show.link_text', { className: 'btn' }), val(nextShow, 'link_text'))
            )
          )
        : hiddenNote('next_show', 'The next show banner is switched off, so it won’t appear on the home page.'),

      h('section', f('features_section', { className: 'features' }),
        h('div', { className: 'container' },
          h('p', f('features_section.subtitle', { className: 'section-subtitle' }), val(featuresSection, 'subtitle')),
          h('h2', f('features_section.heading'), val(featuresSection, 'heading')),
          h('div', f('features', { className: 'features-grid' }),
            features ? features.map(function(card, i) {
              var p = 'features.' + i;
              return h('div', f(p, { className: 'feature-card', key: i }),
                h('div', f(p + '.icon', { className: 'icon' }), val(card, 'icon')),
                h('h3', f(p + '.title'), val(card, 'title')),
                h('p', f(p + '.description'), val(card, 'description'))
              );
            }).toArray() : null
          )
        )
      ),

      h('section', f('cta', { className: 'cta-section' }),
        h('div', { className: 'container' },
          h('h2', f('cta.heading'), val(cta, 'heading')),
          h('p', f('cta.description'), val(cta, 'description')),
          h('a', f('cta.button_text', { className: 'btn btn-primary' }), val(cta, 'button_text'))
        )
      )
    );
  }
});

// ============================================================
// SHOWS & EVENTS (What's On page)
// ============================================================
var WhatsOnPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var pageHeader = entry.getIn(['data', 'page_header']);
    var events = entry.getIn(['data', 'events']);
    var placeholderText = entry.getIn(['data', 'placeholder_text']) || '';
    var pastBanner = entry.getIn(['data', 'past_events_banner']);
    var cta = entry.getIn(['data', 'cta']);

    return h('div', {},
      h('section', f('page_header', { className: 'page-header' }),
        h('div', { className: 'container' },
          h('p', f('page_header.subtitle', { className: 'section-subtitle' }), val(pageHeader, 'subtitle')),
          h('h1', f('page_header.title'), val(pageHeader, 'title')),
          h('p', f('page_header.description'), val(pageHeader, 'description'))
        )
      ),
      h('section', {},
        h('div', f('events', { className: 'container' }),
          events ? events.map(function(event, i) {
            var p = 'events.' + i;
            var hidden = event.get('visible') === false;
            return h('div', f(p, { className: 'event-card' + (hidden ? ' sp-hidden-item' : ''), key: i }),
              hidden ? h('div', { className: 'sp-hidden-badge' }, 'Hidden — not shown on the website') : null,
              h('div', { className: 'event-date-block' },
                h('div', f(p + '.month', { className: 'month' }), val(event, 'month')),
                h('div', f(p + '.day', { className: 'day' }), val(event, 'day')),
                h('div', f(p + '.year', { className: 'year-text' }), val(event, 'year'))
              ),
              h('div', { className: 'event-info' },
                h('h3', f(p + '.title'), val(event, 'title')),
                h('div', { className: 'event-meta' },
                  h('span', f(p + '.location'), '\u{1F4CD} ' + val(event, 'location')),
                  h('span', f(p + '.time'), '\u{1F550} ' + val(event, 'time'))
                ),
                h('p', f(p + '.description'), val(event, 'description')),
                h('div', f(p + '.ticket_url'),
                  event.get('ticket_url')
                    ? h('a', { className: 'btn btn-accent' }, 'Buy Tickets')
                    : h('p', f(p + '.ticket_status', { style: { color: 'var(--accent)', fontWeight: '600', fontSize: '0.9rem' } }), '✳ ' + val(event, 'ticket_status'))
                )
              )
            );
          }).toArray() : null,

          h('div', { style: { textAlign: 'center', padding: '3rem 0' } },
            h('p', f('placeholder_text', { style: { color: 'var(--grey-mid)', fontSize: '0.95rem' }, dangerouslySetInnerHTML: { __html: placeholderText.replace(/\n/g, '<br>') } }))
          )
        )
      ),

      h('section', f('past_events_banner', { className: 'next-show' }),
        h('div', { className: 'container' },
          h('p', f('past_events_banner.subtitle', { className: 'section-subtitle' }), val(pastBanner, 'subtitle')),
          h('h2', f('past_events_banner.title'), val(pastBanner, 'title')),
          h('p', f('past_events_banner.description', { className: 'show-details' }), val(pastBanner, 'description')),
          h('a', f('past_events_banner.link_text', { className: 'btn' }), val(pastBanner, 'link_text'))
        )
      ),

      h('section', f('cta', { className: 'cta-section' }),
        h('div', { className: 'container' },
          h('h2', f('cta.heading'), val(cta, 'heading')),
          h('p', f('cta.description'), val(cta, 'description')),
          h('a', f('cta.button_text', { className: 'btn btn-primary' }), val(cta, 'button_text'))
        )
      )
    );
  }
});

// ============================================================
// ABOUT US & PAST SHOWS
// ============================================================
var AboutPreview = createClass({
  render: function() {
    var props = this.props;
    var entry = props.entry;
    var pageHeader = entry.getIn(['data', 'page_header']);
    var intro = entry.getIn(['data', 'intro']);
    var notableSection = entry.getIn(['data', 'notable_members_section']);
    var members = entry.getIn(['data', 'notable_members']);
    var timelineSection = entry.getIn(['data', 'timeline_section']);
    var timeline = entry.getIn(['data', 'timeline']);
    var prodSection = entry.getIn(['data', 'productions_section']);
    var productions = entry.getIn(['data', 'productions']);
    var cta = entry.getIn(['data', 'cta']);

    return h('div', {},
      h('section', f('page_header', { className: 'page-header' }),
        h('div', { className: 'container' },
          h('p', f('page_header.subtitle', { className: 'section-subtitle' }), val(pageHeader, 'subtitle')),
          h('h1', f('page_header.title'), val(pageHeader, 'title')),
          h('p', f('page_header.description'), val(pageHeader, 'description'))
        )
      ),

      h('section', f('intro'),
        h('div', { className: 'container about-intro' },
          h('div', { className: 'about-text' },
            h('h2', f('intro.heading'), val(intro, 'heading')),
            h('div', f('intro.paragraphs'),
              intro && intro.get('paragraphs') ? intro.get('paragraphs').map(function(para, i) {
                return h('p', f('intro.paragraphs.' + i, { key: i, dangerouslySetInnerHTML: { __html: para } }));
              }).toArray() : null
            ),
            h('a', f('intro.cta_text', { className: 'btn' }), val(intro, 'cta_text'))
          ),
          h('div', f('intro.image', { className: 'about-image' }),
            intro && intro.get('image')
              ? h('img', { src: assetUrl(props, intro.get('image')) })
              : h('span', {}, '\u{1F3AD} Photo coming soon')
          )
        )
      ),

      h('section', f('notable_members_section', { style: { background: 'var(--off-white)' } }),
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('p', f('notable_members_section.subtitle', { className: 'section-subtitle' }), val(notableSection, 'subtitle')),
          h('h2', f('notable_members_section.heading'), val(notableSection, 'heading')),
          h('div', f('notable_members', { className: 'features-grid', style: { marginTop: '2rem' } }),
            members ? members.map(function(member, i) {
              var p = 'notable_members.' + i;
              return h('div', f(p, { className: 'feature-card', style: { background: 'var(--white)' }, key: i }),
                h('div', f(p + '.icon', { className: 'icon' }), val(member, 'icon')),
                h('h3', f(p + '.name'), val(member, 'name')),
                h('p', f(p + '.description', { dangerouslySetInnerHTML: { __html: val(member, 'description') } }))
              );
            }).toArray() : null
          )
        )
      ),

      h('section', f('timeline_section', { className: 'timeline-section' }),
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('p', f('timeline_section.subtitle', { className: 'section-subtitle' }), val(timelineSection, 'subtitle')),
          h('h2', f('timeline_section.heading'), val(timelineSection, 'heading'))
        ),
        h('div', { className: 'container' },
          h('div', f('timeline', { className: 'timeline' }),
            timeline ? timeline.map(function(item, i) {
              var p = 'timeline.' + i;
              return h('div', f(p, { className: 'timeline-item', key: i }),
                h('div', { className: 'timeline-content' },
                  h('div', f(p + '.year', { className: 'timeline-year' }), val(item, 'year')),
                  h('h3', f(p + '.title'), val(item, 'title')),
                  h('p', f(p + '.description'), val(item, 'description'))
                )
              );
            }).toArray() : null
          )
        )
      ),

      h('section', f('productions_section'),
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('p', f('productions_section.subtitle', { className: 'section-subtitle' }), val(prodSection, 'subtitle')),
          h('h2', f('productions_section.heading'), val(prodSection, 'heading'))
        ),
        h('div', { className: 'container' },
          h('div', f('productions', { className: 'productions-grid' }),
            productions ? productions.map(function(prod, i) {
              var p = 'productions.' + i;
              return h('div', f(p, { className: 'production-card', key: i }),
                prod.get('image')
                  ? h('img', f(p + '.image', { src: assetUrl(props, prod.get('image')), style: { width: '100%', aspectRatio: '16/9', objectFit: 'cover', marginBottom: '1.25rem' } }))
                  : h('div', f(p + '.image', { className: 'sp-photo-slot' }), 'No photo yet'),
                h('div', f(p + '.date_label', { className: 'year' }), val(prod, 'date_label')),
                h('h3', f(p + '.title'), val(prod, 'title')),
                h('p', f(p + '.description'), val(prod, 'description'))
              );
            }).toArray() : null
          )
        )
      ),

      h('section', f('cta', { className: 'cta-section' }),
        h('div', { className: 'container' },
          h('h2', f('cta.heading'), val(cta, 'heading')),
          h('p', f('cta.description'), val(cta, 'description')),
          h('a', f('cta.button_text', { className: 'btn btn-primary' }), val(cta, 'button_text'))
        )
      )
    );
  }
});

// ============================================================
// PHOTOS & CONTACT (Contact page)
// ============================================================
var ContactPreview = createClass({
  render: function() {
    var props = this.props;
    var entry = props.entry;
    var pageHeader = entry.getIn(['data', 'page_header']);
    var email = entry.getIn(['data', 'email']) || '';
    var venue = entry.getIn(['data', 'venue']);
    var joinBox = entry.getIn(['data', 'join_box']);
    var subjects = entry.getIn(['data', 'form_subjects']);
    var gallery = entry.getIn(['data', 'gallery']);
    var photos = gallery && gallery.get('photos');

    return h('div', {},
      h('section', f('page_header', { className: 'page-header' }),
        h('div', { className: 'container' },
          h('p', f('page_header.subtitle', { className: 'section-subtitle' }), val(pageHeader, 'subtitle')),
          h('h1', f('page_header.title'), val(pageHeader, 'title')),
          h('p', f('page_header.description'), val(pageHeader, 'description'))
        )
      ),

      h('section', {},
        h('div', { className: 'container' },
          h('div', { className: 'contact-grid' },
            h('div', { className: 'contact-info' },
              h('h3', {}, 'Contact Details'),

              h('div', f('email', { className: 'contact-item' }),
                h('div', { className: 'icon' }, '✉'),
                h('div', {},
                  h('h4', {}, 'Email'),
                  h('a', {}, email)
                )
              ),

              h('div', f('venue', { className: 'contact-item' }),
                h('div', { className: 'icon' }, '\u{1F4CD}'),
                h('div', {},
                  h('h4', {}, 'Venue'),
                  h('p', {},
                    h('span', f('venue.name'), val(venue, 'name')), ', ',
                    h('span', f('venue.address'), val(venue, 'address')), ', ',
                    h('span', f('venue.postcode'), val(venue, 'postcode'))
                  )
                )
              ),

              h('div', f('join_box', { className: 'join-box' }),
                h('h4', f('join_box.heading'), val(joinBox, 'heading')),
                h('p', f('join_box.text', { dangerouslySetInnerHTML: { __html: val(joinBox, 'text') } }))
              )
            ),

            h('div', { className: 'contact-form' },
              h('h3', {}, 'Send Us a Message'),
              h('p', f('form_subjects', { style: { color: 'var(--grey-mid)', fontSize: '0.9rem' } }),
                'Subject choices: ' + (subjects ? subjects.toArray().join(' · ') : '')
              )
            )
          )
        )
      ),

      h('section', f('gallery', { style: { background: 'var(--off-white)' } }),
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('h2', f('gallery.heading'), val(gallery, 'heading')),
          photos && photos.size
            ? h('div', f('gallery.photos', { className: 'gallery-grid' }),
                photos.map(function(photo, i) {
                  var p = 'gallery.photos.' + i;
                  return h('div', f(p, { className: 'gallery-item', key: i }),
                    photo.get('image')
                      ? h('img', f(p + '.image', { src: assetUrl(props, photo.get('image')), alt: val(photo, 'caption') }))
                      : h('div', f(p + '.image', { className: 'sp-photo-slot' }), 'Choose a photo'),
                    photo.get('caption') ? h('p', f(p + '.caption', { className: 'gallery-caption' }), photo.get('caption')) : null
                  );
                }).toArray()
              )
            : h('p', f('gallery.photos', { style: { color: 'var(--grey-mid)', marginTop: '1.5rem' } }), 'Photos coming soon — check back after our next production!')
        )
      )
    );
  }
});

// ============================================================
// SOCIAL MEDIA & SETTINGS (shown roughly as the site footer)
// ============================================================
var SitePreview = createClass({
  render: function() {
    var props = this.props;
    var data = props.entry.get('data');
    var socials = data.get('social_links');

    return h('div', { style: { padding: '2rem' } },
      h('p', { className: 'section-subtitle' }, 'Website footer'),

      h('div', f('social_links', { style: { margin: '1.5rem 0 2rem' } }),
        h('h4', { style: { marginBottom: '0.75rem' } }, 'Follow Us'),
        socials ? socials.map(function(s, i) {
          var p = 'social_links.' + i;
          // Logos come from /admin/social-icons.js (built from src/_data/socialIcons.js)
          var logo = (window.SP_SOCIAL_ICONS || {})[val(s, 'platform')];
          return h('div', f(p, { key: i, style: { display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' } }),
            h('span', f(p + '.platform', { className: 'sp-social-logo' }),
              logo ? h('span', { dangerouslySetInnerHTML: { __html: logo } }) : null,
              h('strong', null, val(s, 'platform'))
            ),
            h('span', f(p + '.handle'), val(s, 'handle')),
            h('span', f(p + '.url', { style: { color: 'var(--grey-mid)', fontSize: '0.85rem' } }), val(s, 'url'))
          );
        }).toArray() : null
      ),

      h('div', f('logo', { style: { marginBottom: '1.5rem' } }),
        data.get('logo') ? h('img', { src: assetUrl(props, data.get('logo')), style: { maxWidth: '120px' } }) : null
      ),
      h('h3', f('name'), data.get('name') || ''),
      h('p', f('tagline', { style: { margin: '0.75rem 0 1.5rem', maxWidth: '40rem' } }), data.get('tagline') || ''),
      h('p', f('copyright_year', { style: { color: 'var(--grey-mid)', fontSize: '0.9rem' } }),
        '© ' + (data.get('copyright_year') || '') + ' ' + (data.get('name') || '') + '. All rights reserved.')
    );
  }
});

// ============================================================
// REGISTER ALL PREVIEWS
// ============================================================
CMS.registerPreviewStyle('/admin/preview.css');

CMS.registerPreviewTemplate('home', HomePreview);
CMS.registerPreviewTemplate('about', AboutPreview);
CMS.registerPreviewTemplate('whats_on', WhatsOnPreview);
CMS.registerPreviewTemplate('contact', ContactPreview);
CMS.registerPreviewTemplate('site', SitePreview);
