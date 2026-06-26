import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

export function RiveLoaderCanvas({ src }: { src: string }) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return <RiveComponent />;
}
