import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TOOLS } from '@/lib/constants';

export function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Repurpose Content</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Six powerful AI tools that transform your raw content into platform-ready formats in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Card key={tool.id} className="rounded-2xl shadow hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <div className="text-4xl mb-2">{tool.icon}</div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
                <p className="mt-3 text-xs font-medium text-primary">{tool.credits} credit{tool.credits > 1 ? 's' : ''} per use</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Generate content in under 60 seconds with async processing' },
            { icon: '🔒', title: 'Secure & Private', desc: 'Your content is never stored or used to train AI models' },
            { icon: '♾️', title: 'Multi-Platform', desc: 'Outputs optimized for Twitter, LinkedIn, email, and YouTube' },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
