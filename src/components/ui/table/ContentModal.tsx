import { Modal } from "@mantine/core";

interface ContentModalProps {
  opened: boolean;
  onClose: () => void;
  content: string;
}

export default function ContentModal({
  opened,
  onClose,
  content,
}: ContentModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Post Content" size="lg">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Modal>
  );
}
