import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const OfferAcceptedSeeker = () => {
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchSeekers = async () => {
      try {
        const res = await axios.get("/employer/accepted-seekers");
        setOffers(res.data.acceptedJobSeekers || []);
      } catch (err) {
        console.error("Failed to fetch offered seekers:", err);
      }
    };

    fetchSeekers();
  }, []);

  return (
    <Box px={{ xs: 2, md: 10 }} py={4}>
      <p className="!text-2xl text-red-700 md:!text-4xl Yusei_Magic font-extrabold mb-0">
        All Seekers Who Accept the offer
      </p>
      <div className="h-[1px] mt-4 mb-4 bg-red-700" />
      {offers.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          className="text-center mt-8"
        >
          No Accepted Seeker found.
        </Typography>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            display: "flex",
            gap: 2,
            paddingBottom: 2,
          }}
        >
          {offers.map((offer, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 300,
                flex: "0 0 auto",
              }}
              elevation={3}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Avatar
                    src="https://randomuser.me/api/portraits/lego/3.jpg"
                    alt="Seeker"
                    sx={{ width: 48, height: 48 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(offer.acceptedAt), "dd MMM yyyy")}
                  </Typography>
                </Box>

                <Typography variant="h6" mt={2} fontWeight="bold" color="error">
                  {offer.jobTitle}
                </Typography>

                <Typography variant="subtitle1" mt={1}>
                  {offer.jobSeeker.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {offer.jobSeeker.email}
                </Typography>

                <Typography variant="body2" mt={1}>
                  <strong>Domain:</strong> {offer.jobSeeker.domain}
                </Typography>

                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {offer.jobSeeker.skills?.map((skill, i) => (
                    <Chip label={skill} key={i} variant="outlined" />
                  ))}
                </Box>

                <button
                 
                  onClick={() => setSelected(offer)}
                  className="red-button"
                >
                  View Details
                </button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Modal for detailed view */}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" color="error" fontWeight="bold">
              {selected?.jobSeeker?.name}
            </Typography>
            <IconButton onClick={() => setSelected(null)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {selected?.jobSeeker?.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Domain:</strong> {selected?.jobSeeker?.domain}
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Skills:</strong>{" "}
            {selected?.jobSeeker?.skills?.join(", ") || "No skills listed"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Offered For:</strong> {selected?.jobTitle}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default OfferAcceptedSeeker;
