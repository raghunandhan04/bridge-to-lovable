import React from 'react';
import { cn } from '@/lib/utils';
import { BlogStructure, ContentBlock } from '@/components/ui/drag-drop-blog-editor';
import { Card } from '@/components/ui/card';

interface BlogRendererProps {
  blog: {
    title: string;
    excerpt?: string;
    content: string;
    featured_image_url?: string;
    created_at: string;
    category: string;
    blog_structure?: BlogStructure;
  };
  className?: string;
}

const BlogRenderer: React.FC<BlogRendererProps> = ({ blog, className }) => {
  // Render structured content blocks
  const renderContentBlock = (block: ContentBlock) => {
    const { content } = block;

    const commonImageClasses = cn(
      "rounded-lg transition-all duration-500 ease-out hover:scale-105 hover:shadow-glow hover:brightness-110",
      content.hasBorder && "border-2 border-border",
      content.hasShadow && "shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"  
    );

    const commonTextClasses = cn(
      "leading-relaxed",
      content.fontSize === 'sm' && "text-sm",
      content.fontSize === 'base' && "text-base", 
      content.fontSize === 'lg' && "text-lg",
      content.fontSize === 'xl' && "text-xl",
      content.fontWeight === 'normal' && "font-normal",
      content.fontWeight === 'medium' && "font-medium",
      content.fontWeight === 'semibold' && "font-semibold",
      content.fontWeight === 'bold' && "font-bold",
      content.alignment === 'left' && "text-left",
      content.alignment === 'center' && "text-center",
      content.alignment === 'right' && "text-right"
    );

    switch (block.type) {
      case 'left-image-right-text':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={content.imageUrl} 
                alt={content.caption || 'Image'}
                title={content.caption || 'Image'}
                className={cn(commonImageClasses, "w-full h-64 object-cover")}
                style={{ width: `${content.width}%`, color: content.textColor }}
              />
            </div>
            <div className="order-1 lg:order-2">
              <div 
                className={commonTextClasses}
                style={{ color: content.textColor }}
              >
                {content.text}
              </div>
            </div>
          </div>
        );

      case 'right-image-left-text':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div 
                className={commonTextClasses}
                style={{ color: content.textColor }}
              >
                {content.text}
              </div>
            </div>
            <div className="order-2">
              <img 
                src={content.imageUrl} 
                alt={content.caption || 'Image'}
                title={content.caption || 'Image'}
                className={cn(commonImageClasses, "w-full h-64 object-cover")}
                style={{ width: `${content.width}%` }}
              />
            </div>
          </div>
        );

      case 'full-width-image':
        return (
          <div className={cn("w-full", `text-${content.alignment}`)}>
            <img 
              src={content.imageUrl} 
              alt={content.caption || 'Image'}
              title={content.caption || 'Image'}
              className={cn(commonImageClasses, "w-full h-80 object-cover")}
              style={{ width: `${content.width}%` }}
            />
            {content.caption && (
              <p className="text-sm text-muted-foreground mt-3 italic">
                {content.caption}
              </p>
            )}
          </div>
        );

      case 'full-width-text':
        return (
          <div className={cn("w-full prose prose-lg max-w-none", `text-${content.alignment}`)}>
            <div 
              className={commonTextClasses}
              style={{ color: content.textColor }}
              dangerouslySetInnerHTML={{ __html: content.text || '' }}
            />
          </div>
        );

      case 'image-caption':
        return (
          <div className={cn("w-full", `text-${content.alignment}`)}>
            <figure>
              <img 
                src={content.imageUrl} 
                alt={content.caption || 'Image'}
                title={content.caption || 'Image'}
                className={cn(commonImageClasses, "w-full h-64 object-cover mx-auto")}
                style={{ width: `${content.width}%` }}
              />
              {content.caption && (
                <figcaption className="text-sm text-muted-foreground mt-3 italic">
                  {content.caption}
                </figcaption>
              )}
            </figure>
          </div>
        );

      case 'video-embed':
        return (
          <div className={cn("w-full", `text-${content.alignment}`)}>
            <div 
              className="aspect-video mx-auto overflow-hidden rounded-lg shadow-lg"
              style={{ width: `${content.width}%` }}
            >
              <iframe
                src={content.videoUrl}
                title={content.videoUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        );

      case 'table':
        if (!content.tableData) return null;
        return (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse bg-background rounded-lg overflow-hidden shadow-sm border border-border">
              <thead>
                <tr className="bg-muted/50">
                  {content.tableData.headers.map((header, i) => (
                    <th 
                      key={i} 
                      className="border border-border p-4 text-left font-semibold text-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.tableData.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    {row.map((cell, j) => (
                      <td 
                        key={j} 
                        className="border border-border p-4 text-foreground"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'chart':
        if (!content.chartData) return null;
        return (
          <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">
              {content.chartData.title}
            </h3>
            
            {content.chartData.type === 'pie' && (
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                <div className="relative">
                  <svg width="240" height="240" viewBox="0 0 100 100" className="transform -rotate-90">
                    {(() => {
                      const total = content.chartData.data.reduce((sum, val) => sum + val, 0);
                      let currentAngle = 0;
                      
                      return content.chartData.data.map((value, index) => {
                        const percentage = (value / total) * 100;
                        const angle = (value / total) * 360;
                        const x1 = 50 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
                        const y1 = 50 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);
                        const x2 = 50 + 40 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                        const y2 = 50 + 40 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                        const largeArc = angle > 180 ? 1 : 0;
                        
                        const path = `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArc},1 ${x2},${y2} z`;
                        const color = `hsl(${(index * 360 / content.chartData.data.length)}, 70%, 60%)`;
                        
                        currentAngle += angle;
                        
                        return (
                          <path 
                            key={index}
                            d={path} 
                            fill={color} 
                            stroke="white" 
                            strokeWidth="1"
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
                <div className="space-y-3">
                  {content.chartData.labels.map((label, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-sm"
                        style={{ 
                          backgroundColor: `hsl(${(i * 360 / content.chartData.data.length)}, 70%, 60%)` 
                        }}
                      />
                      <span className="text-sm font-medium">
                        {label}: {content.chartData.data[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.chartData.type === 'bar' && (
              <div className="space-y-4">
                <svg 
                  width="100%" 
                  height="300" 
                  viewBox={`0 0 ${Math.max(400, content.chartData.data.length * 80)} 300`}
                  className="mx-auto"
                >
                  {content.chartData.data.map((value, index) => {
                    const maxValue = Math.max(...content.chartData.data);
                    const height = (value / maxValue) * 200;
                    const x = index * 80 + 40;
                    const color = `hsl(${(index * 360 / content.chartData.data.length)}, 70%, 60%)`;
                    
                    return (
                      <g key={index}>
                        <rect 
                          x={x} 
                          y={250 - height} 
                          width="60" 
                          height={height} 
                          fill={color} 
                          rx="4"
                          className="hover:opacity-80 transition-opacity"
                        />
                        <text 
                          x={x + 30} 
                          y="275" 
                          textAnchor="middle" 
                          className="text-xs fill-muted-foreground"
                        >
                          {content.chartData.labels[index]}
                        </text>
                        <text 
                          x={x + 30} 
                          y={245 - height} 
                          textAnchor="middle" 
                          className="text-xs fill-foreground font-medium"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {content.chartData.type === 'line' && (
              <div className="space-y-4">
                <svg width="100%" height="300" viewBox="0 0 400 300" className="mx-auto">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(220, 70%, 60%)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="hsl(220, 70%, 60%)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {(() => {
                    const maxValue = Math.max(...content.chartData.data);
                    const points = content.chartData.data.map((value, index) => {
                      const x = (index / (content.chartData.data.length - 1)) * 320 + 40;
                      const y = 240 - (value / maxValue) * 180;
                      return `${x},${y}`;
                    }).join(' ');
                    
                    const areaPoints = `40,240 ${points} ${40 + 320},240`;
                    
                    return (
                      <g>
                        <polygon 
                          points={areaPoints}
                          fill="url(#lineGradient)"
                          className="opacity-50"
                        />
                        <polyline 
                          points={points} 
                          fill="none" 
                          stroke="hsl(220, 70%, 60%)" 
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {content.chartData.data.map((value, index) => {
                          const x = (index / (content.chartData.data.length - 1)) * 320 + 40;
                          const y = 240 - (value / maxValue) * 180;
                          
                          return (
                            <g key={index}>
                              <circle 
                                cx={x} 
                                cy={y} 
                                r="6" 
                                fill="hsl(220, 70%, 60%)" 
                                stroke="white" 
                                strokeWidth="2"
                                className="hover:r-8 transition-all cursor-pointer"
                              />
                              <text 
                                x={x} 
                                y="265" 
                                textAnchor="middle" 
                                className="text-xs fill-muted-foreground"
                              >
                                {content.chartData.labels[index]}
                              </text>
                              <text 
                                x={x} 
                                y={y - 10} 
                                textAnchor="middle" 
                                className="text-xs fill-foreground font-medium"
                              >
                                {value}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  // If blog has structured content, render it
  if (blog.blog_structure && blog.blog_structure.blocks.length > 0) {
    return (
      <article className={cn("blog-renderer max-w-4xl mx-auto", className)}>
        {/* Header */}
        <header className="mb-12">
          {blog.blog_structure.featuredImage && (
            <div className="mb-8">
              <img 
                src={blog.blog_structure.featuredImage}
                alt={blog.blog_structure.title}
                className="w-full h-80 object-cover image-hero"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {blog.blog_structure.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {blog.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">By {blog.blog_structure.author}</span>
              <span>•</span>
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span className="capitalize bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {blog.category}
              </span>
            </div>
          </div>
        </header>

        {/* Content Blocks */}
        <div className="space-y-12">
          {blog.blog_structure.blocks.map((block, index) => (
            <div key={block.id} className="animate-in fade-in duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              {renderContentBlock(block)}
            </div>
          ))}
        </div>
      </article>
    );
  }

  // Fallback to classic content rendering
  return (
    <article className={cn("blog-renderer max-w-4xl mx-auto prose prose-lg", className)}>
      {/* Header */}
      <header className="not-prose mb-12">
        {blog.featured_image_url && (
          <div className="mb-8">
            <img 
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full h-80 object-cover image-hero"
            />
          </div>
        )}
        
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {blog.title}
          </h1>
          
          {blog.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={blog.created_at}>
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span className="capitalize bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
          </div>
        </div>
      </header>

      {/* Classic Content */}
      <div 
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </article>
  );
};

export default BlogRenderer;