import { useState } from 'react';
import { Phone, ExternalLink, BookOpen, Play, Filter, Navigation } from 'lucide-react';

const CATEGORIES = ['All', 'Anxiety', 'Depression', 'Stress', 'Cognitive', 'Sleep', 'Students'];

const ARTICLES = [
  { id: 1, category: 'Anxiety', title: 'Understanding Anxiety Disorders', desc: 'Comprehensive guide by NIMH covering causes, symptoms, and evidence-based treatments for anxiety.', source: 'NIMH', badge: 'Expert Verified', color: 'var(--teal)', url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders', emoji: '😰', readTime: '8 min read' },
  { id: 2, category: 'Depression', title: 'Depression: What You Need to Know', desc: 'NIMH explains depression symptoms, risk factors, and effective therapies including CBT and medication.', source: 'NIMH', badge: 'Expert Verified', color: 'var(--lavender)', url: 'https://www.nimh.nih.gov/health/publications/depression', emoji: '💙', readTime: '10 min read' },
  { id: 3, category: 'Stress', title: '5 Things You Should Know About Stress', desc: 'Science-backed overview of stress responses, long-term effects, and practical coping strategies.', source: 'NIMH', badge: 'Expert Verified', color: 'var(--sand)', url: 'https://www.nimh.nih.gov/health/publications/stress', emoji: '😤', readTime: '5 min read' },
  { id: 4, category: 'Cognitive', title: 'Mental Health and People with Intellectual Disabilities', desc: 'NAMI guide on supporting individuals with cognitive disabilities through mental health challenges.', source: 'NAMI', badge: 'Expert Verified', color: 'var(--sage)', url: 'https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness', emoji: '🧠', readTime: '12 min read' },
  { id: 5, category: 'Students', title: 'College Students & Mental Health', desc: "NAMI's guide for students managing academics, social pressure, and emotional well-being at school.", source: 'NAMI', badge: 'Expert Verified', color: 'var(--teal)', url: 'https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness/Taking-Care-of-Your-Body/College-Students-Mental-Health', emoji: '📚', readTime: '7 min read' },
  { id: 6, category: 'Sleep', title: 'Sleep and Mental Health', desc: 'Harvard Health explores the bidirectional relationship between sleep quality and mental well-being.', source: 'Harvard Health', badge: 'Expert Verified', color: 'var(--sand)', url: 'https://www.health.harvard.edu/newsletter_article/sleep-and-mental-health', emoji: '🌙', readTime: '6 min read' },
  { id: 7, category: 'Anxiety', title: 'Mindfulness Meditation for Anxiety', desc: 'Research-backed article on how mindfulness reduces anxiety and improves emotional regulation.', source: 'APA', badge: 'Expert Verified', color: 'var(--teal)', url: 'https://www.apa.org/topics/mindfulness/meditation', emoji: '🧘', readTime: '9 min read' },
  { id: 8, category: 'Students', title: 'Coping with Academic Stress', desc: "American Psychological Association's practical strategies for managing school and exam pressure.", source: 'APA', badge: 'Expert Verified', color: 'var(--sage)', url: 'https://www.apa.org/topics/stress/academic', emoji: '🎓', readTime: '6 min read' },
  { id: 9, category: 'Cognitive', title: 'Emotional Regulation Skills', desc: 'DBT-based strategies for managing intense emotions, especially helpful for cognitive and developmental differences.', source: 'NAMI', badge: 'Expert Verified', color: 'var(--lavender)', url: 'https://www.nami.org/Blogs/NAMI-Blog/August-2019/DBT-An-Effective-Treatment-for-Borderline-Personality-Disorder', emoji: '💡', readTime: '8 min read' },
  { id: 10, category: 'Depression', title: 'Building Resilience', desc: 'APA guide on developing psychological resilience and bouncing back from adversity and depression.', source: 'APA', badge: 'Expert Verified', color: 'var(--sand)', url: 'https://www.apa.org/topics/resilience', emoji: '💪', readTime: '7 min read' },
  { id: 11, category: 'Sleep', title: 'Healthy Sleep Habits', desc: "American Academy of Sleep Medicine's evidence-based guide to improving sleep quality and routine.", source: 'AASM', badge: 'Expert Verified', color: 'var(--teal)', url: 'https://sleepeducation.org/healthy-sleep/healthy-sleep-habits/', emoji: '😴', readTime: '5 min read' },
  { id: 12, category: 'Stress', title: 'Relaxation Techniques for Stress', desc: "Mayo Clinic's overview of deep breathing, progressive muscle relaxation, guided imagery, and more.", source: 'Mayo Clinic', badge: 'Expert Verified', color: 'var(--sage)', url: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/relaxation-technique/art-20045368', emoji: '🌿', readTime: '6 min read' },
];

const VIDEOS = [
  { id: 'v1', title: 'What is Depression?', channel: 'TED-Ed', videoId: 'z-IR48Mb3W0', category: 'Depression', duration: '4:33' },
  { id: 'v2', title: 'How to cope with anxiety', channel: 'TED', videoId: 'WWloIAQpaMc', category: 'Anxiety', duration: '14:28' },
  { id: 'v3', title: 'The Art of Being Yourself', channel: 'TEDx', videoId: 'veEQQ-N9xWU', category: 'Students', duration: '14:47' },
  { id: 'v4', title: 'How to make stress your friend', channel: 'TED', videoId: 'RcGyVTAoXEU', category: 'Stress', duration: '14:28' },
  { id: 'v5', title: 'Sleep is your superpower', channel: 'TED', videoId: 'WmMBAmCOSMU', category: 'Sleep', duration: '19:18' },
  { id: 'v6', title: 'The Power of Mindfulness', channel: 'TEDx', videoId: 'IeblJdB2-Vo', category: 'Cognitive', duration: '17:45' },
];

const HELPLINES = [
  { name: '988 Suicide & Crisis Lifeline', desc: '24/7 crisis support — call or text', phone: '988', emoji: '🆘', color: 'var(--crimson)', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.25)' },
  { name: 'Crisis Text Line', desc: 'Text HOME to 741741 — free, 24/7', phone: '741741', sms: true, emoji: '💬', color: 'var(--teal)', bg: 'rgba(78,205,196,0.08)', border: 'rgba(78,205,196,0.25)' },
  { name: 'NAMI Helpline', desc: 'Mon–Fri 10am–10pm ET — information & support', phone: '1-800-950-6264', emoji: '🤝', color: 'var(--sage)', bg: 'rgba(168,230,207,0.08)', border: 'rgba(168,230,207,0.25)' },
  { name: 'SAMHSA Helpline', desc: 'Free, confidential, 24/7 treatment referrals', phone: '1-800-662-4357', emoji: '🏥', color: 'var(--lavender)', bg: 'rgba(162,155,254,0.08)', border: 'rgba(162,155,254,0.25)' },
];

const EXPERT_TYPES = [
  { emoji: '👨‍⚕️', title: 'Psychiatrist', desc: 'Medical doctor who can diagnose mental health conditions and prescribe medication.', search: 'psychiatrist' },
  { emoji: '🧑‍💻', title: 'Psychologist', desc: 'PhD-level specialist in talk therapy, CBT, and psychological testing.', search: 'psychologist' },
  { emoji: '🤝', title: 'Therapist / Counselor', desc: 'Licensed therapist providing talk therapy, CBT, DBT and coping strategies.', search: 'mental+health+therapist+counselor' },
  { emoji: '👩‍👩‍👧', title: 'Support Groups', desc: 'Free peer-led support groups for anxiety, depression, and more.', search: 'mental+health+support+group' },
];

function ExpertMap({ coords, searchType }: any) {
  const [loaded, setLoaded] = useState(false);
  const mapQuery = encodeURIComponent(`${searchType.replace(/\+/g, ' ')} near me`);
  const src = coords ? `https://maps.google.com/maps?q=${mapQuery}&ll=${coords.lat},${coords.lng}&z=13&output=embed` : `https://maps.google.com/maps?q=${mapQuery}&output=embed`;
  const mapsUrl = coords ? `https://www.google.com/maps/search/${mapQuery}/@${coords.lat},${coords.lng},14z` : `https://www.google.com/maps/search/${mapQuery}`;
  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
      {!loaded && <div style={{ height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface2)', gap: 10 }}><div style={{ fontSize: 36 }}>🗺️</div><div style={{ fontSize: '0.85rem', color: 'var(--txt3)' }}>Loading map…</div></div>}
      <iframe title="Expert Map" src={src} width="100%" height="340" style={{ display: loaded ? 'block' : 'none', border: 'none' }} onLoad={() => setLoaded(true)} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 14px', borderRadius: 10, fontWeight: 700, fontSize: '0.75rem', background: 'rgba(10,16,20,0.85)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <ExternalLink size={12} /> Open in Google Maps
        </a>
      </div>
    </div>
  );
}

export default function Resources({ setCurrentPage }: any) {
  const [tab, setTab] = useState('resources');
  const [category, setCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [coords, setCoords] = useState<any>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [mapSearch, setMapSearch] = useState('mental+health+therapist');

  const filteredArticles = category === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === category);
  const filteredVideos = category === 'All' ? VIDEOS : VIDEOS.filter(v => v.category === category);

  const getLocation = () => {
    setLocating(true); setLocError('');
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => { setLocError('Could not get location. Please allow location access or search manually.'); setLocating(false); }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: 'var(--surface2)', borderRadius: 14, padding: 4, width: 'fit-content' }}>
        {[{ id: 'resources', label: '📚 Educational Resources' }, { id: 'experts', label: '🗺️ Find an Expert' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '9px 20px', borderRadius: 10, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', border: 'none', transition: 'all 0.2s', background: tab === t.id ? 'var(--teal)' : 'transparent', color: tab === t.id ? '#0a1918' : 'var(--txt3)' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ borderRadius: 20, padding: '24px 28px', background: 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(168,230,207,0.06))', border: '1px solid rgba(78,205,196,0.2)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📖</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 6 }}>Expert-Verified Mental Health Resources</h2>
            <p style={{ fontSize: '0.87rem', color: 'var(--txt2)', lineHeight: 1.65, maxWidth: 560 }}>Curated articles and videos from leading institutions — NIMH, NAMI, APA, Harvard Health, and Mayo Clinic — reviewed by mental health professionals.</p>
          </div>

          <div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
              <Filter size={13} style={{ color: 'var(--txt3)' }} />
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{ padding: '5px 14px', borderRadius: 20, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', border: 'none', transition: 'all 0.18s', background: category === c ? 'var(--teal)' : 'var(--surface2)', color: category === c ? '#0a1918' : 'var(--txt3)' }}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-title" style={{ marginBottom: 14 }}><BookOpen size={14} style={{ display: 'inline', marginRight: 6 }} />Articles & Guides <span style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 500, marginLeft: 8 }}>{filteredArticles.length} resources</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {filteredArticles.map(a => (
                <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className="card card-interactive" style={{ padding: '18px 20px', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ fontSize: 28 }}>{a.emoji}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 700, background: 'rgba(78,205,196,0.1)', color: 'var(--teal)', letterSpacing: '0.06em' }}>✓ {a.badge}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 700, background: 'var(--surface2)', color: 'var(--txt3)' }}>{a.category}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--txt)', marginBottom: 6, lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--txt3)', lineHeight: 1.55, marginBottom: 12 }}>{a.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.7rem', color: a.color, fontWeight: 700 }}>{a.source}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--teal)' }}>{a.readTime} <ExternalLink size={10} /></div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {filteredVideos.length > 0 && (
            <div>
              <div className="section-title" style={{ marginBottom: 14 }}><Play size={14} style={{ display: 'inline', marginRight: 6 }} />Expert Videos <span style={{ fontSize: '0.72rem', color: 'var(--txt3)', fontWeight: 500, marginLeft: 8 }}>TED Talks & educational content</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {filteredVideos.map(v => (
                  <div key={v.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {activeVideo === v.id ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&rel=0&modestbranding=1`}
                        width="100%"
                        height="185"
                        frameBorder="0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        style={{ display: 'block' }}
                      />
                    ) : (
                      <button onClick={() => setActiveVideo(v.id)} style={{ width: '100%', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', display: 'block' }}>
                        <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
                          <img
                            src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                            alt={v.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                            onError={e => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.style.display = 'none';
                            }}
                          />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', transition: 'transform 0.15s' }}>
                              <Play size={20} style={{ color: '#e00', marginLeft: 3 }} />
                            </div>
                          </div>
                          <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: 5, fontWeight: 700 }}>{v.duration}</div>
                        </div>
                      </button>
                    )}
                    <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--txt)', lineHeight: 1.4 }}>{v.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--txt3)', flex: 1 }}>{v.channel} · {v.category}</div>
                      <a
                        href={`https://www.youtube.com/watch?v=${v.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.66rem', color: 'var(--teal)', textDecoration: 'none', fontWeight: 600, marginTop: 2, width: 'fit-content' }}
                      >
                        <ExternalLink size={10} /> Watch on YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'experts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div className="section-title" style={{ marginBottom: 14 }}>🆘 Crisis Helplines — Call Now</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {HELPLINES.map(h => (
                <div key={h.name} style={{ borderRadius: 16, padding: '16px 18px', background: h.bg, border: `1.5px solid ${h.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{h.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: h.color, marginBottom: 2 }}>{h.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--txt3)', marginBottom: 8 }}>{h.desc}</div>
                    <a href={(h as any).sms ? `sms:${h.phone}` : `tel:${h.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 10, textDecoration: 'none', background: h.color, color: '#0a1918', fontWeight: 700, fontSize: '0.78rem' }}>
                      {(h as any).sms ? '💬' : <Phone size={12} />}
                      {(h as any).sms ? `Text ${h.phone}` : `Call ${h.phone}`}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>🗺️ Find Experts Near You</div>
              <button onClick={getLocation} disabled={locating} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 12, cursor: locating ? 'not-allowed' : 'pointer', background: coords ? 'rgba(78,205,196,0.15)' : 'var(--teal)', border: `1.5px solid ${coords ? 'rgba(78,205,196,0.4)' : 'transparent'}`, color: coords ? 'var(--teal)' : '#0a1918', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s', opacity: locating ? 0.7 : 1 }}>
                <Navigation size={14} style={{ animation: locating ? 'spin 1s linear infinite' : 'none' }} />
                {locating ? 'Locating…' : coords ? '📍 Location found' : 'Use My Location'}
              </button>
            </div>
            {locError && <div style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem', color: 'var(--crimson)', marginBottom: 12 }}>{locError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
              {EXPERT_TYPES.map(e => (
                <button key={e.search} onClick={() => setMapSearch(e.search)} style={{ padding: '10px 8px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${mapSearch === e.search ? 'rgba(78,205,196,0.5)' : 'var(--border)'}`, background: mapSearch === e.search ? 'rgba(78,205,196,0.1)' : 'var(--surface2)', textAlign: 'center', transition: 'all 0.18s' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{e.emoji}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: mapSearch === e.search ? 'var(--teal)' : 'var(--txt2)', lineHeight: 1.3 }}>{e.title}</div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(78,205,196,0.05)', border: '1px solid rgba(78,205,196,0.15)', fontSize: '0.8rem', color: 'var(--txt2)' }}>
              {EXPERT_TYPES.find(e => e.search === mapSearch)?.desc}
            </div>
            <ExpertMap coords={coords} searchType={mapSearch} />
            <p style={{ marginTop: 8, fontSize: '0.7rem', color: 'var(--txt3)', lineHeight: 1.6 }}>Map shows results from Google Maps. Click "Open in Google Maps" for full details, directions, reviews, and to call directly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
