export default function Loader({ size = 18, color = "white" }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
    />
  )
}
