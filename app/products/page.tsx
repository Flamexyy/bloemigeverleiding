<div className="relative aspect-square overflow-hidden rounded-2xl bg-accent/10">
  {product.imageUrl ? (
    <Image
      src={product.imageUrl}
      alt={product.title}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
    />
  ) : (
    // Placeholder with shopping bag icon when no image is available
    <div className="w-full h-full flex items-center justify-center bg-accent/20">
      <CgShoppingBag className="text-text/50 text-4xl" />
    </div>
  )}
</div> 