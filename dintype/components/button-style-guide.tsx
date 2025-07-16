import { Button } from "@/components/ui/custom-button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Save,
  Trash2,
  Download,
  Upload,
  Plus,
  Minus,
  Edit,
  Check,
  RefreshCw,
  Search,
  Send,
  Heart,
  Share2,
} from "lucide-react"

export function ButtonStyleGuide() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Button Variants</h2>
        <ButtonGroup spacing="normal">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="adult">Adult</Button>
        </ButtonGroup>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button Sizes</h2>
        <ButtonGroup spacing="normal">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="wide">Wide Button</Button>
        </ButtonGroup>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Loading States</h2>
        <ButtonGroup spacing="normal">
          <Button isLoading loadingText="Loading...">
            Submit
          </Button>
          <Button variant="outline" isLoading loadingText="Saving...">
            Save
          </Button>
          <Button variant="destructive" isLoading loadingText="Deleting...">
            Delete
          </Button>
        </ButtonGroup>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">With Icons</h2>
        <ButtonGroup spacing="normal">
          <Button leftIcon={<Save className="h-4 w-4" />}>Save</Button>
          <Button rightIcon={<Download className="h-4 w-4" />}>Download</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} rightIcon={<Check className="h-4 w-4" />}>
            Add Item
          </Button>
        </ButtonGroup>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Full Width</h2>
        <div className="space-y-2 max-w-md">
          <Button fullWidth>Full Width Button</Button>
          <Button variant="outline" fullWidth leftIcon={<Search className="h-4 w-4" />}>
            Search
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button Groups</h2>
        <div className="space-y-4">
          <ButtonGroup>
            <Button variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
          </ButtonGroup>

          <ButtonGroup vertical>
            <Button>Top</Button>
            <Button>Middle</Button>
            <Button>Bottom</Button>
          </ButtonGroup>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Common Action Buttons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="adult" leftIcon={<Save className="h-4 w-4" />}>
            Save
          </Button>
          <Button variant="destructive" leftIcon={<Trash2 className="h-4 w-4" />}>
            Delete
          </Button>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Download
          </Button>
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>
            Upload
          </Button>
          <Button variant="default" leftIcon={<Send className="h-4 w-4" />}>
            Send
          </Button>
          <Button variant="secondary" leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button variant="outline" leftIcon={<Heart className="h-4 w-4" />}>
            Favorite
          </Button>
          <Button variant="outline" leftIcon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Disabled States</h2>
        <ButtonGroup spacing="normal">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
          <Button variant="destructive" disabled>
            Disabled Destructive
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
