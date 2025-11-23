interface IProductCardTextProps {
    text: string;
}

export const ProductCardText = ({ text } : IProductCardTextProps) => {
    return (
        <p>{text}</p>
    )
}