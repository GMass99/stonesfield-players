// ============================================================
// HOME PAGE PREVIEW
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

      // Hero
      h('section', { className: 'hero' },
        h('div', { className: 'hero-content container' },
          h('h1', { dangerouslySetInnerHTML: { __html: hero && hero.get('heading') || '' } }),
          h('p', {}, hero && hero.get('description') || ''),
          h('div', { style: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' } },
            h('a', { className: 'btn btn-primary' }, hero && hero.get('cta_primary_text') || ''),
            h('a', { className: 'btn' }, hero && hero.get('cta_secondary_text') || '')
          )
        )
      ),

      // Next Show
      nextShow && nextShow.get('visible') ? h('section', { className: 'next-show' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, nextShow.get('subtitle') || ''),
          h('h2', {}, nextShow.get('title') || ''),
          h('p', { className: 'show-details' }, nextShow.get('details') || ''),
          h('a', { className: 'btn' }, nextShow.get('link_text') || '')
        )
      ) : null,

      // Features
      h('section', { className: 'features' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, featuresSection && featuresSection.get('subtitle') || ''),
          h('h2', {}, featuresSection && featuresSection.get('heading') || ''),
          h('div', { className: 'features-grid' },
            features ? features.map(function(card, i) {
              return h('div', { className: 'feature-card', key: i },
                h('div', { className: 'icon' }, card.get('icon') || ''),
                h('h3', {}, card.get('title') || ''),
                h('p', {}, card.get('description') || '')
              );
            }).toArray() : null
          )
        )
      ),

      // CTA
      h('section', { className: 'cta-section' },
        h('div', { className: 'container' },
          h('h2', {}, cta && cta.get('heading') || ''),
          h('p', {}, cta && cta.get('description') || ''),
          h('a', { className: 'btn btn-primary' }, cta && cta.get('button_text') || '')
        )
      )
    );
  }
});

// ============================================================
// EVENTS PAGE PREVIEW
// ============================================================
var EventsPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var items = entry.getIn(['data', 'items']);

    return h('div', {},
      h('section', { className: 'page-header' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, "What's On"),
          h('h1', {}, 'Upcoming Events')
        )
      ),
      h('section', {},
        h('div', { className: 'container' },
          items ? items.map(function(event, i) {
            return event.get('visible') !== false ? h('div', { className: 'event-card', key: i },
              h('div', { className: 'event-date-block' },
                h('div', { className: 'month' }, event.get('month') || ''),
                h('div', { className: 'day' }, event.get('day') || ''),
                h('div', { className: 'year-text' }, event.get('year') || '')
              ),
              h('div', { className: 'event-info' },
                h('h3', {}, event.get('title') || ''),
                h('div', { className: 'event-meta' },
                  h('span', {}, '\u{1F4CD} ' + (event.get('location') || '')),
                  h('span', {}, '\u{1F550} ' + (event.get('time') || ''))
                ),
                h('p', {}, event.get('description') || ''),
                event.get('ticket_url')
                  ? h('a', { className: 'btn btn-accent' }, 'Buy Tickets')
                  : h('p', { style: { color: 'var(--accent)', fontWeight: '600', fontSize: '0.9rem' } }, '\u2733 ' + (event.get('ticket_status') || ''))
              )
            ) : null;
          }).toArray() : null
        )
      )
    );
  }
});

// ============================================================
// PRODUCTIONS PREVIEW
// ============================================================
var ProductionsPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var items = entry.getIn(['data', 'items']);

    return h('div', {},
      h('section', {},
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('p', { className: 'section-subtitle' }, 'On Stage'),
          h('h2', {}, 'Past Productions')
        ),
        h('div', { className: 'container' },
          h('div', { className: 'productions-grid' },
            items ? items.map(function(prod, i) {
              return h('div', { className: 'production-card', key: i },
                h('div', { className: 'year' }, prod.get('date_label') || ''),
                h('h3', {}, prod.get('title') || ''),
                h('p', {}, prod.get('description') || '')
              );
            }).toArray() : null
          )
        )
      )
    );
  }
});

// ============================================================
// NOTABLE MEMBERS PREVIEW
// ============================================================
var MembersPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var items = entry.getIn(['data', 'items']);

    return h('div', {},
      h('section', { style: { background: 'var(--off-white)' } },
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('p', { className: 'section-subtitle' }, 'Notable Members'),
          h('h2', {}, 'Some Familiar Names'),
          h('div', { className: 'features-grid', style: { marginTop: '2rem' } },
            items ? items.map(function(member, i) {
              return h('div', { className: 'feature-card', style: { background: 'var(--white)' }, key: i },
                h('div', { className: 'icon' }, member.get('icon') || ''),
                h('h3', {}, member.get('name') || ''),
                h('p', { dangerouslySetInnerHTML: { __html: member.get('description') || '' } })
              );
            }).toArray() : null
          )
        )
      )
    );
  }
});

// ============================================================
// TIMELINE PREVIEW
// ============================================================
var TimelinePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var items = entry.getIn(['data', 'items']);

    return h('div', {},
      h('section', { className: 'timeline-section' },
        h('div', { className: 'container', style: { textAlign: 'center' } },
          h('p', { className: 'section-subtitle' }, 'Through the Years'),
          h('h2', {}, 'Our History')
        ),
        h('div', { className: 'container' },
          h('div', { className: 'timeline' },
            items ? items.map(function(entry, i) {
              return h('div', { className: 'timeline-item', key: i },
                h('div', { className: 'timeline-content' },
                  h('div', { className: 'timeline-year' }, entry.get('year') || ''),
                  h('h3', {}, entry.get('title') || ''),
                  h('p', {}, entry.get('description') || '')
                )
              );
            }).toArray() : null
          )
        )
      )
    );
  }
});

// ============================================================
// ABOUT PAGE PREVIEW
// ============================================================
var AboutPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var pageHeader = entry.getIn(['data', 'page_header']);
    var intro = entry.getIn(['data', 'intro']);
    var notableSection = entry.getIn(['data', 'notable_members_section']);
    var timelineSection = entry.getIn(['data', 'timeline_section']);
    var prodSection = entry.getIn(['data', 'productions_section']);
    var cta = entry.getIn(['data', 'cta']);

    return h('div', {},
      h('section', { className: 'page-header' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, pageHeader && pageHeader.get('subtitle') || ''),
          h('h1', {}, pageHeader && pageHeader.get('title') || ''),
          h('p', {}, pageHeader && pageHeader.get('description') || '')
        )
      ),

      h('section', {},
        h('div', { className: 'container about-intro' },
          h('div', { className: 'about-text' },
            h('h2', {}, intro && intro.get('heading') || ''),
            intro && intro.get('paragraphs') ? intro.get('paragraphs').map(function(p, i) {
              return h('p', { key: i, dangerouslySetInnerHTML: { __html: p } });
            }).toArray() : null,
            h('a', { className: 'btn' }, intro && intro.get('cta_text') || '')
          ),
          h('div', { className: 'about-image' },
            intro && intro.get('image')
              ? h('img', { src: intro.get('image') })
              : h('span', {}, '\u{1F3AD} Photo coming soon')
          )
        )
      ),

      h('section', { style: { background: 'var(--off-white)', textAlign: 'center' } },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, notableSection && notableSection.get('subtitle') || ''),
          h('h2', {}, notableSection && notableSection.get('heading') || '')
        )
      ),

      h('section', { className: 'timeline-section', style: { textAlign: 'center' } },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, timelineSection && timelineSection.get('subtitle') || ''),
          h('h2', {}, timelineSection && timelineSection.get('heading') || '')
        )
      ),

      h('section', { style: { textAlign: 'center' } },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, prodSection && prodSection.get('subtitle') || ''),
          h('h2', {}, prodSection && prodSection.get('heading') || '')
        )
      ),

      h('section', { className: 'cta-section' },
        h('div', { className: 'container' },
          h('h2', {}, cta && cta.get('heading') || ''),
          h('p', {}, cta && cta.get('description') || ''),
          h('a', { className: 'btn btn-primary' }, cta && cta.get('button_text') || '')
        )
      )
    );
  }
});

// ============================================================
// EVENTS PAGE CONTENT PREVIEW
// ============================================================
var EventsPagePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var pageHeader = entry.getIn(['data', 'page_header']);
    var placeholderText = entry.getIn(['data', 'placeholder_text']) || '';
    var pastBanner = entry.getIn(['data', 'past_events_banner']);
    var cta = entry.getIn(['data', 'cta']);

    return h('div', {},
      h('section', { className: 'page-header' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, pageHeader && pageHeader.get('subtitle') || ''),
          h('h1', {}, pageHeader && pageHeader.get('title') || ''),
          h('p', {}, pageHeader && pageHeader.get('description') || '')
        )
      ),

      h('section', {},
        h('div', { className: 'container', style: { textAlign: 'center', padding: '3rem 0' } },
          h('p', { style: { color: 'var(--grey-mid)', fontSize: '0.95rem' }, dangerouslySetInnerHTML: { __html: placeholderText.replace(/\n/g, '<br>') } })
        )
      ),

      h('section', { className: 'next-show' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, pastBanner && pastBanner.get('subtitle') || ''),
          h('h2', {}, pastBanner && pastBanner.get('title') || ''),
          h('p', { className: 'show-details' }, pastBanner && pastBanner.get('description') || ''),
          h('a', { className: 'btn' }, pastBanner && pastBanner.get('link_text') || '')
        )
      ),

      h('section', { className: 'cta-section' },
        h('div', { className: 'container' },
          h('h2', {}, cta && cta.get('heading') || ''),
          h('p', {}, cta && cta.get('description') || ''),
          h('a', { className: 'btn btn-primary' }, cta && cta.get('button_text') || '')
        )
      )
    );
  }
});

// ============================================================
// CONTACT PAGE PREVIEW
// ============================================================
var ContactPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var pageHeader = entry.getIn(['data', 'page_header']);
    var joinBox = entry.getIn(['data', 'join_box']);

    return h('div', {},
      h('section', { className: 'page-header' },
        h('div', { className: 'container' },
          h('p', { className: 'section-subtitle' }, pageHeader && pageHeader.get('subtitle') || ''),
          h('h1', {}, pageHeader && pageHeader.get('title') || ''),
          h('p', {}, pageHeader && pageHeader.get('description') || '')
        )
      ),

      h('section', {},
        h('div', { className: 'container' },
          h('div', { className: 'join-box' },
            h('h4', {}, joinBox && joinBox.get('heading') || ''),
            h('p', { dangerouslySetInnerHTML: { __html: joinBox && joinBox.get('text') || '' } })
          )
        )
      )
    );
  }
});

// ============================================================
// SITE SETTINGS PREVIEW
// ============================================================
var SitePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var data = entry.get('data');

    return h('div', { style: { padding: '2rem' } },
      h('h2', { style: { marginBottom: '2rem' } }, 'Site Settings Preview'),

      h('div', { style: { marginBottom: '1.5rem' } },
        h('strong', {}, 'Group Name: '),
        h('span', {}, data.get('name') || '')
      ),

      h('div', { style: { marginBottom: '1.5rem' } },
        h('strong', {}, 'Tagline: '),
        h('span', {}, data.get('tagline') || '')
      ),

      h('div', { style: { marginBottom: '1.5rem' } },
        h('strong', {}, 'Email: '),
        h('span', {}, data.get('email') || '')
      ),

      data.get('venue') ? h('div', { style: { marginBottom: '1.5rem' } },
        h('strong', {}, 'Venue: '),
        h('span', {}, data.getIn(['venue', 'name']) + ', ' + data.getIn(['venue', 'address']) + ', ' + data.getIn(['venue', 'postcode']))
      ) : null,

      h('div', { style: { marginBottom: '1.5rem' } },
        h('strong', {}, 'Instagram: '),
        h('span', {}, data.get('instagram_handle') || '')
      ),

      data.get('logo') ? h('div', {},
        h('strong', {}, 'Logo:'),
        h('img', { src: data.get('logo'), style: { maxWidth: '150px', marginTop: '0.5rem' } })
      ) : null
    );
  }
});

// ============================================================
// REGISTER ALL PREVIEWS
// ============================================================
CMS.registerPreviewStyle('/admin/preview.css');

CMS.registerPreviewTemplate('home', HomePreview);
CMS.registerPreviewTemplate('about', AboutPreview);
CMS.registerPreviewTemplate('events_page', EventsPagePreview);
CMS.registerPreviewTemplate('contact', ContactPreview);
CMS.registerPreviewTemplate('events_list', EventsPreview);
CMS.registerPreviewTemplate('productions_list', ProductionsPreview);
CMS.registerPreviewTemplate('notable_members_list', MembersPreview);
CMS.registerPreviewTemplate('timeline_list', TimelinePreview);
CMS.registerPreviewTemplate('site', SitePreview);
