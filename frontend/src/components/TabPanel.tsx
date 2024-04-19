import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  selectedValue: string;
  value: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, selectedValue, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== selectedValue}
      id={`vertical-tabpanel-${value}`}
      aria-labelledby={`vertical-tab-${value}`}
      {...other}
    >
      {value === selectedValue && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel;
