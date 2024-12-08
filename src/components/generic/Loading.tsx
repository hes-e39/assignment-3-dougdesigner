import styled from 'styled-components';

const primaryColor = '#ffa2bf';

type Size = 'small' | 'medium' | 'large';

const sizeMapping: Record<Size, number> = {
    small: 10,
    medium: 14,
    large: 20,
};

const Container = styled.div`
  animation: spin 1.5s linear infinite;

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

const Dot = styled.span<{ size: number }>`
  display: block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: wobble 1s ease-in-out infinite;

  @keyframes wobble {
    0% {
      border-radius: 25%;
    }
    100% {
      border-radius: 100%;
    }
  }
`;

const DotGroup = styled.div`
  display: flex;
`;

const Loading = ({
    size = 'medium',
    color = primaryColor,
}: {
    size: Size;
    color: string;
}) => {
    return (
        <Container>
            <DotGroup>
                <Dot size={sizeMapping[size]} color={color} />
                <Dot size={sizeMapping[size]} color={color} />
            </DotGroup>
            <DotGroup>
                <Dot size={sizeMapping[size]} color={color} />
                <Dot size={sizeMapping[size]} color={color} />
            </DotGroup>
        </Container>
    );
};

export default Loading;
