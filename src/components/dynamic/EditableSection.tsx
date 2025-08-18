import React from 'react';
import { cn } from '@/lib/utils';

interface EditableSectionProps {
  sectionId: string;
  field?: string;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  sectionId,
  field = 'content',
  children,
  className,
  as: Component = 'div'
}) => {
  return (
    <Component
      className={cn(className)}
      data-section-id={sectionId}
      data-field={field}
    >
      <span data-editable-text>
        {children}
      </span>
    </Component>
  );
};

export default EditableSection;