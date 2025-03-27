import { Block } from "@shared/schema";
import BlockWrapper from "./BlockWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Video, Link } from "lucide-react";

// IMAGE BLOCK
export function ImageBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    src: "", 
    alt: "", 
    width: "100%", 
    height: "auto",
    align: "center" 
  };

  return (
    <BlockWrapper block={block} isSelected={isSelected} onUpdate={onUpdate}>
      {properties.src ? (
        <div className={`flex justify-${properties.align}`}>
          <img 
            src={properties.src} 
            alt={properties.alt || ""} 
            style={{ 
              width: properties.width, 
              height: properties.height === "auto" ? "auto" : properties.height
            }}
            className="max-w-full"
          />
        </div>
      ) : (
        <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-4">
          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-blue-500">Click to select image</span>
        </div>
      )}
    </BlockWrapper>
  );
}

export function ImageProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    src: "", 
    alt: "", 
    width: "100%", 
    height: "auto",
    align: "center" 
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-src">Image URL</Label>
        <Input
          id="image-src"
          type="text"
          value={properties.src || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, src: e.target.value } 
          })}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="image-alt">Alt Text</Label>
        <Input
          id="image-alt"
          type="text"
          value={properties.alt || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, alt: e.target.value } 
          })}
          placeholder="Descriptive image text"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image-width">Width</Label>
          <Input
            id="image-width"
            type="text"
            value={properties.width || "100%"}
            onChange={(e) => onChange({ 
              properties: { ...properties, width: e.target.value } 
            })}
            placeholder="100%, 300px, etc."
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="image-height">Height</Label>
          <Input
            id="image-height"
            type="text"
            value={properties.height || "auto"}
            onChange={(e) => onChange({ 
              properties: { ...properties, height: e.target.value } 
            })}
            placeholder="auto, 200px, etc."
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Alignment</Label>
        <RadioGroup 
          value={properties.align || "center"} 
          onValueChange={(value) => onChange({ 
            properties: { ...properties, align: value } 
          })}
          className="flex mt-2 space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center">Center</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Right</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

// VIDEO BLOCK
export function VideoBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    src: "", 
    type: "youtube", 
    width: "100%", 
    height: "315",
    controls: true,
    autoplay: false
  };

  const renderVideo = () => {
    if (!properties.src) {
      return (
        <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-4 h-48">
          <Video className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-blue-500">Add video URL in properties</span>
        </div>
      );
    }

    if (properties.type === "youtube") {
      // Extract YouTube ID from URL
      const youtubeId = getYoutubeId(properties.src);
      if (!youtubeId) {
        return (
          <div className="bg-gray-100 rounded flex flex-col items-center justify-center p-4 h-48">
            <span className="text-sm text-red-500">Invalid YouTube URL</span>
          </div>
        );
      }

      return (
        <iframe
          width={properties.width}
          height={properties.height}
          src={`https://www.youtube.com/embed/${youtubeId}${properties.autoplay ? '?autoplay=1' : ''}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="max-w-full"
        ></iframe>
      );
    } else {
      return (
        <video
          src={properties.src}
          width={properties.width}
          height={properties.height}
          controls={properties.controls}
          autoPlay={properties.autoplay}
          className="max-w-full"
        />
      );
    }
  };

  // Helper function to extract YouTube video ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <BlockWrapper block={block} isSelected={isSelected} onUpdate={onUpdate}>
      <div className="flex justify-center">
        {renderVideo()}
      </div>
    </BlockWrapper>
  );
}

export function VideoProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    src: "", 
    type: "youtube", 
    width: "100%", 
    height: "315",
    controls: true,
    autoplay: false
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Video Type</Label>
        <RadioGroup 
          value={properties.type || "youtube"} 
          onValueChange={(value) => onChange({ 
            properties: { ...properties, type: value } 
          })}
          className="flex mt-2 space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="youtube" id="youtube" />
            <Label htmlFor="youtube">YouTube</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video">Direct Video</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="video-src">
          {properties.type === "youtube" ? "YouTube URL" : "Video URL"}
        </Label>
        <Input
          id="video-src"
          type="text"
          value={properties.src || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, src: e.target.value } 
          })}
          placeholder={properties.type === "youtube" 
            ? "https://www.youtube.com/watch?v=..."
            : "https://example.com/video.mp4"}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="video-width">Width</Label>
          <Input
            id="video-width"
            type="text"
            value={properties.width || "100%"}
            onChange={(e) => onChange({ 
              properties: { ...properties, width: e.target.value } 
            })}
            placeholder="100%, 560px, etc."
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="video-height">Height</Label>
          <Input
            id="video-height"
            type="text"
            value={properties.height || "315"}
            onChange={(e) => onChange({ 
              properties: { ...properties, height: e.target.value } 
            })}
            placeholder="315px, etc."
            className="mt-1"
          />
        </div>
      </div>

      {properties.type === "video" && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              id="video-controls"
              type="checkbox"
              checked={properties.controls !== false}
              onChange={(e) => onChange({ 
                properties: { ...properties, controls: e.target.checked } 
              })}
              className="rounded"
            />
            <Label htmlFor="video-controls">Show Controls</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="video-autoplay"
              type="checkbox"
              checked={properties.autoplay === true}
              onChange={(e) => onChange({ 
                properties: { ...properties, autoplay: e.target.checked } 
              })}
              className="rounded"
            />
            <Label htmlFor="video-autoplay">Autoplay</Label>
          </div>
        </div>
      )}
    </div>
  );
}
