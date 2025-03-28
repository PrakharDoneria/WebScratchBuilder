import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BlockData, blockCategories } from "@/lib/blockUtils";
import { Search } from "lucide-react";

interface BlockPaletteProps {
  onAddBlock: (blockType: string) => void;
}

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = searchTerm.trim() === ""
    ? blockCategories
    : blockCategories.map(category => ({
        ...category,
        blocks: category.blocks.filter(block =>
          block.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.blocks.length > 0);

  return (
    <div className="md:w-64 bg-background border-r border-border overflow-y-auto flex-shrink-0 h-full scrollbar-styled">
      <div className="p-4">
        <h2 className="font-semibold text-foreground mb-3">Block Palette</h2>
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-background border-border text-foreground"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Block Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="block-category">
              <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                <category.icon className="h-4 w-4 mr-2" /> {category.name}
              </h3>
              <div className="space-y-2">
                {category.blocks.map((block) => (
                  <div
                    key={block.type}
                    className="block bg-card border border-border rounded-md p-2 cursor-grab hover:bg-accent/50 transition-colors"
                    onClick={() => onAddBlock(block.type)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("blockType", block.type);
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`mr-2 w-5 h-5 ${block.iconBg} rounded-md flex items-center justify-center`}>
                        <block.icon className={`h-3 w-3 ${block.iconColor}`} />
                      </div>
                      <span className="text-sm text-foreground">{block.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No blocks match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
